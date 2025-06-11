/* eslint-disable prefer-const */
import { ONE_BD, ZERO_BD, ZERO_BI } from "./constants";
import { Bundle, Pool, Token } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { exponentToBigDecimal, safeDiv } from "./index";

// prettier-ignore
const WETH_ADDRESS = "0xc5f15624b4256c1206e4bb93f2ccc9163a75b703";

// prettier-ignore
export const EXPORT_WETH_ADDRESS = "0xc5f15624b4256c1206e4bb93f2ccc9163a75b703";

// prettier-ignore
export const EXPORT_USDT_ADDRESS = "0xdfae88f8610a038afcdf47a5bc77c0963c65087c";

// prettier-ignore
const USDC_WETH_03_POOL = "0x546b56f6a294750ea44d0b58ca2bb0a7201518e6";

const STABLE_IS_TOKEN0 = "false" as string;

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
// prettier-ignore
export let WHITELIST_TOKENS: string[] = "0xc5f15624b4256c1206e4bb93f2ccc9163a75b703,0x4ebbe24182e9c14e1d2e02ab9459190f39c43b6f,0x73fe4db0779022ff9c0b32ef2644272b32bef5b7,0xdfae88f8610a038afcdf47a5bc77c0963c65087c,0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0,0xcedb8ee7c0e21bdd78f46e334a33ed17189131d5,0x7bd3dc0e0e1e1ccce1657a18cbe32f13f9fc9376,0x94504f356a267f3a128c2e6387281bccdbd821a0,0xa4447a108e92b8c36de0fb310d43f95c54fc81e2,0xf25394ebb6d132d21bce902f759f592954e898cd,0xfd7ea8beabf2999dcf7f97a694b7fda60ac4bf20,0xbeb74c0c2cc994c8fad7ba91fae15b5b748cd707".split(",");

// prettier-ignore
let STABLE_COINS: string[] = "0xdfae88f8610a038afcdf47a5bc77c0963c65087c,0x73fe4db0779022ff9c0b32ef2644272b32bef5b7,0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0".split(",");

let MINIMUM_ETH_LOCKED = BigDecimal.fromString("1");

let Q192 = 2 ** 192;
export function sqrtPriceX96ToTokenPrices(sqrtPriceX96: BigInt, token0: Token, token1: Token): BigDecimal[] {
  let num = sqrtPriceX96.times(sqrtPriceX96).toBigDecimal();
  let denom = BigDecimal.fromString(Q192.toString());
  let price1 = num.div(denom).times(exponentToBigDecimal(token0.decimals)).div(exponentToBigDecimal(token1.decimals));

  let price0 = safeDiv(BigDecimal.fromString("1"), price1);
  return [price0, price1];
}

export function getEthPriceInUSD(): BigDecimal {
  // fetch eth prices for each stablecoin
  let usdcPool = Pool.load(USDC_WETH_03_POOL); // dai is token0
  if (usdcPool !== null) {
    if (STABLE_IS_TOKEN0 === "true") {
      return usdcPool.token0Price;
    }
    return usdcPool.token1Price;
  } else {
    return ZERO_BD;
  }
}

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BD;
  }
  let whiteList = token.whitelistPools;
  // for now just take USD from pool with greatest TVL
  // need to update this to actually detect best rate based on liquidity distribution
  let largestLiquidityETH = ZERO_BD;
  let priceSoFar = ZERO_BD;
  let bundle = Bundle.load("1");

  // hardcoded fix for incorrect rates
  // if whitelist includes token - get the safe price
  if (STABLE_COINS.includes(token.id)) {
    priceSoFar = safeDiv(ONE_BD, bundle.ethPriceUSD);
  } else {
    for (let i = 0; i < whiteList.length; ++i) {
      let poolAddress = whiteList[i];
      let pool = Pool.load(poolAddress);

      if (pool.liquidity.gt(ZERO_BI)) {
        if (pool.token0 == token.id) {
          // whitelist token is token1
          let token1 = Token.load(pool.token1);
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken1.times(token1.derivedETH);
          if (
            ethLocked.gt(largestLiquidityETH) &&
            (ethLocked.gt(MINIMUM_ETH_LOCKED) || WHITELIST_TOKENS.includes(pool.token0))
          ) {
            largestLiquidityETH = ethLocked;
            // token1 per our token * Eth per token1
            priceSoFar = pool.token1Price.times(token1.derivedETH as BigDecimal);
          }
        }
        if (pool.token1 == token.id) {
          let token0 = Token.load(pool.token0);
          // get the derived ETH in pool
          let ethLocked = pool.totalValueLockedToken0.times(token0.derivedETH);
          if (
            ethLocked.gt(largestLiquidityETH) &&
            (ethLocked.gt(MINIMUM_ETH_LOCKED) || WHITELIST_TOKENS.includes(pool.token1))
          ) {
            largestLiquidityETH = ethLocked;
            // token0 per our token * ETH per token0
            priceSoFar = pool.token0Price.times(token0.derivedETH as BigDecimal);
          }
        }
      }
    }
  }
  return priceSoFar; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load("1");
  let price0USD = token0.derivedETH.times(bundle.ethPriceUSD);
  let price1USD = token1.derivedETH.times(bundle.ethPriceUSD);

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).plus(tokenAmount1.times(price1USD));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(price0USD).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount1.times(price1USD).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedAmountETH(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let derivedETH0 = token0.derivedETH;
  let derivedETH1 = token1.derivedETH;

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(derivedETH0).plus(tokenAmount1.times(derivedETH1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount0.times(derivedETH0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    return tokenAmount1.times(derivedETH1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked amount is 0
  return ZERO_BD;
}

export class AmountType {
  eth: BigDecimal;
  usd: BigDecimal;
  ethUntracked: BigDecimal;
  usdUntracked: BigDecimal;
}

export function getAdjustedAmounts(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): AmountType {
  let derivedETH0 = token0.derivedETH;
  let derivedETH1 = token1.derivedETH;
  let bundle = Bundle.load("1");

  let eth = ZERO_BD;
  let ethUntracked = tokenAmount0.times(derivedETH0).plus(tokenAmount1.times(derivedETH1));

  // both are whitelist tokens, return sum of both amounts
  if (WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    eth = ethUntracked;
  }

  // take double value of the whitelisted token amount
  if (WHITELIST_TOKENS.includes(token0.id) && !WHITELIST_TOKENS.includes(token1.id)) {
    eth = tokenAmount0.times(derivedETH0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST_TOKENS.includes(token0.id) && WHITELIST_TOKENS.includes(token1.id)) {
    eth = tokenAmount1.times(derivedETH1).times(BigDecimal.fromString("2"));
  }

  // Define USD values based on ETH derived values.
  let usd = eth.times(bundle.ethPriceUSD);
  let usdUntracked = ethUntracked.times(bundle.ethPriceUSD);

  return { eth, usd, ethUntracked, usdUntracked };
}
