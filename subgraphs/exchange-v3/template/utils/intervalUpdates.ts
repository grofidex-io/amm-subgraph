import { ZERO_BD, ZERO_BI, ONE_BI } from "./constants";
import {
  PancakeDayData,
  Factory,
  Pool,
  PoolDayData,
  PoolDayCandleData,
  PoolWeekCandleData,
  PoolMinuteCandleData,
  Pool5MinuteCandleData,
  Pool15MinuteCandleData,
  Pool30MinuteCandleData,
  PoolMonthCandleData,
  Token,
  TokenDayData,
  TokenHourData,
  Bundle,
  PoolHourData,
  PoolHourCandleData,
  TickDayData,
  Tick,
} from "../generated/schema";
import { FACTORY_ADDRESS } from "./constants";
import { BigInt, ethereum } from "@graphprotocol/graph-ts";

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export function updatePancakeDayData(event: ethereum.Event): PancakeDayData {
  let pancake = Factory.load(FACTORY_ADDRESS);
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400; // rounded
  let dayStartTimestamp = dayID * 86400;
  let pancakeDayData = PancakeDayData.load(dayID.toString());
  if (pancakeDayData === null) {
    pancakeDayData = new PancakeDayData(dayID.toString());
    pancakeDayData.date = dayStartTimestamp;
    pancakeDayData.volumeETH = ZERO_BD;
    pancakeDayData.volumeUSD = ZERO_BD;
    pancakeDayData.volumeUSDUntracked = ZERO_BD;
    pancakeDayData.feesUSD = ZERO_BD;
    pancakeDayData.protocolFeesUSD = ZERO_BD;
  }
  pancakeDayData.tvlUSD = pancake.totalValueLockedUSD;
  pancakeDayData.txCount = pancake.txCount;
  pancakeDayData.save();
  return pancakeDayData as PancakeDayData;
}

export function updatePoolMonthData(event: ethereum.Event): PoolMonthCandleData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400 / 30;
  let dayStartTimestamp = dayID * 86400 * 30;
  // let dayPoolID = event.address.toHexString().concat("-").concat(dayStartTimestamp.toString());
  let pool = Pool.load(event.address.toHexString());
  let dayPoolID = pool.token0.concat(pool.token1).concat("-").concat(dayStartTimestamp.toString());
  let poolDayData = PoolMonthCandleData.load(dayPoolID);

  if (poolDayData === null) {
    poolDayData = new PoolMonthCandleData(dayPoolID);
    poolDayData.date = BigInt.fromString(dayStartTimestamp.toString()).toI32();
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.protocolFeesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI;
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI;
    poolDayData.open0 = pool.token0Price;
    poolDayData.high0 = pool.token0Price;
    poolDayData.low0 = pool.token0Price;
    poolDayData.close0 = pool.token0Price;
    poolDayData.open1 = pool.token1Price;
    poolDayData.high1 = pool.token1Price;
    poolDayData.low1 = pool.token1Price;
    poolDayData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolDayData.high0)) {
    poolDayData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low0)) {
    poolDayData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolDayData.high1)) {
    poolDayData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolDayData.low1)) {
    poolDayData.low1 = pool.token1Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.close0 = pool.token0Price;
  poolDayData.close1 = pool.token1Price;
  poolDayData.save();

  return poolDayData as PoolMonthCandleData;
}

export function updatePoolDayData(event: ethereum.Event): PoolDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let dayPoolID = event.address.toHexString().concat("-").concat(dayID.toString());
  let pool = Pool.load(event.address.toHexString());
  let poolDayData = PoolDayData.load(dayPoolID);
  if (poolDayData === null) {
    poolDayData = new PoolDayData(dayPoolID);
    poolDayData.date = dayStartTimestamp;
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.protocolFeesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI;
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI;
    poolDayData.open = pool.token0Price;
    poolDayData.high = pool.token0Price;
    poolDayData.low = pool.token0Price;
    poolDayData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolDayData.high)) {
    poolDayData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low)) {
    poolDayData.low = pool.token0Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.close = pool.token0Price;
  poolDayData.save();

  return poolDayData as PoolDayData;
}

export function updatePoolDayCandleData(event: ethereum.Event): PoolDayCandleData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  // let dayPoolID = event.address.toHexString().concat("-").concat(dayID.toString());
  let pool = Pool.load(event.address.toHexString());
  let dayPoolID = pool.token0.concat(pool.token1).concat("-").concat(dayStartTimestamp.toString());
  let poolDayData = PoolDayCandleData.load(dayPoolID);
  if (poolDayData === null) {
    poolDayData = new PoolDayCandleData(dayPoolID);
    poolDayData.date = dayStartTimestamp;
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.protocolFeesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI;
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI;
    poolDayData.open0 = pool.token0Price;
    poolDayData.high0 = pool.token0Price;
    poolDayData.low0 = pool.token0Price;
    poolDayData.close0 = pool.token0Price;
    poolDayData.open1 = pool.token1Price;
    poolDayData.high1 = pool.token1Price;
    poolDayData.low1 = pool.token1Price;
    poolDayData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolDayData.high0)) {
    poolDayData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low0)) {
    poolDayData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolDayData.high1)) {
    poolDayData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolDayData.low1)) {
    poolDayData.low1 = pool.token1Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.close0 = pool.token0Price;
  poolDayData.close1 = pool.token1Price;
  poolDayData.save();

  return poolDayData as PoolDayCandleData;
}

export function updatePoolWeekData(event: ethereum.Event): PoolWeekCandleData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400 / 7;
  let dayStartTimestamp = dayID * 7 * 86400;
  // let dayPoolID = event.address.toHexString().concat("-").concat(dayID.toString());
  let pool = Pool.load(event.address.toHexString());
  let dayPoolID = pool.token0.concat(pool.token1).concat("-").concat(dayStartTimestamp.toString());
  let poolDayData = PoolWeekCandleData.load(dayPoolID);
  if (poolDayData === null) {
    poolDayData = new PoolWeekCandleData(dayPoolID);
    poolDayData.date = dayStartTimestamp;
    poolDayData.pool = pool.id;
    // things that dont get initialized always
    poolDayData.volumeToken0 = ZERO_BD;
    poolDayData.volumeToken1 = ZERO_BD;
    poolDayData.volumeUSD = ZERO_BD;
    poolDayData.feesUSD = ZERO_BD;
    poolDayData.protocolFeesUSD = ZERO_BD;
    poolDayData.txCount = ZERO_BI;
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI;
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI;
    poolDayData.open0 = pool.token0Price;
    poolDayData.high0 = pool.token0Price;
    poolDayData.low0 = pool.token0Price;
    poolDayData.close0 = pool.token0Price;
    poolDayData.open1 = pool.token1Price;
    poolDayData.high1 = pool.token1Price;
    poolDayData.low1 = pool.token1Price;
    poolDayData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolDayData.high0)) {
    poolDayData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolDayData.low0)) {
    poolDayData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolDayData.high1)) {
    poolDayData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolDayData.low1)) {
    poolDayData.low1 = pool.token1Price;
  }

  poolDayData.liquidity = pool.liquidity;
  poolDayData.sqrtPrice = pool.sqrtPrice;
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolDayData.token0Price = pool.token0Price;
  poolDayData.token1Price = pool.token1Price;
  poolDayData.tick = pool.tick;
  poolDayData.tvlUSD = pool.totalValueLockedUSD;
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI);
  poolDayData.close0 = pool.token0Price;
  poolDayData.close1 = pool.token1Price;
  poolDayData.save();

  return poolDayData as PoolWeekCandleData;
}

export function updatePoolHourData(event: ethereum.Event): PoolHourData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let poolHourData = PoolHourData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open = pool.token0Price;
    poolHourData.high = pool.token0Price;
    poolHourData.low = pool.token0Price;
    poolHourData.close = pool.token0Price;
  }

  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close = pool.token0Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolHourData;
}

export function updatePoolHourCandleData(event: ethereum.Event): PoolHourCandleData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  // let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let hourPoolID = pool.token0.concat(pool.token1).concat("-").concat(hourIndex.toString());
  let poolHourData = PoolHourCandleData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolHourCandleData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open0 = pool.token0Price;
    poolHourData.high0 = pool.token0Price;
    poolHourData.low0 = pool.token0Price;
    poolHourData.close0 = pool.token0Price;
    poolHourData.open1 = pool.token1Price;
    poolHourData.high1 = pool.token1Price;
    poolHourData.low1 = pool.token1Price;
    poolHourData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolHourData.high0)) {
    poolHourData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low0)) {
    poolHourData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolHourData.high1)) {
    poolHourData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolHourData.low1)) {
    poolHourData.low1 = pool.token1Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close0 = pool.token0Price;
  poolHourData.close1 = pool.token1Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolHourCandleData;
}

export function updatePoolMinuteData(event: ethereum.Event): PoolMinuteCandleData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 60; // get unique hour within unix history
  let hourStartUnix = hourIndex * 60; // want the rounded effect
  // let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let hourPoolID = pool.token0.concat(pool.token1).concat("-").concat(hourIndex.toString());
  let poolHourData = PoolMinuteCandleData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new PoolMinuteCandleData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open0 = pool.token0Price;
    poolHourData.high0 = pool.token0Price;
    poolHourData.low0 = pool.token0Price;
    poolHourData.close0 = pool.token0Price;
    poolHourData.open1 = pool.token1Price;
    poolHourData.high1 = pool.token1Price;
    poolHourData.low1 = pool.token1Price;
    poolHourData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolHourData.high0)) {
    poolHourData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low0)) {
    poolHourData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolHourData.high1)) {
    poolHourData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolHourData.low1)) {
    poolHourData.low1 = pool.token1Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close0 = pool.token0Price;
  poolHourData.close1 = pool.token1Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as PoolMinuteCandleData;
}

export function updatePool5MinuteData(event: ethereum.Event): Pool5MinuteCandleData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 60 / 5; // get unique hour within unix history
  let hourStartUnix = hourIndex * 60 * 5; // want the rounded effect
  // let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let hourPoolID = pool.token0.concat(pool.token1).concat("-").concat(hourIndex.toString());
  let poolHourData = Pool5MinuteCandleData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new Pool5MinuteCandleData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open0 = pool.token0Price;
    poolHourData.high0 = pool.token0Price;
    poolHourData.low0 = pool.token0Price;
    poolHourData.close0 = pool.token0Price;
    poolHourData.open1 = pool.token1Price;
    poolHourData.high1 = pool.token1Price;
    poolHourData.low1 = pool.token1Price;
    poolHourData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolHourData.high0)) {
    poolHourData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low0)) {
    poolHourData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolHourData.high1)) {
    poolHourData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolHourData.low1)) {
    poolHourData.low1 = pool.token1Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close0 = pool.token0Price;
  poolHourData.close1 = pool.token1Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as Pool5MinuteCandleData;
}

export function updatePool15MinuteData(event: ethereum.Event): Pool15MinuteCandleData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 15 / 60; // get unique hour within unix history
  let hourStartUnix = hourIndex * 15 * 60; // want the rounded effect
  // let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let hourPoolID = pool.token0.concat(pool.token1).concat("-").concat(hourIndex.toString());
  let poolHourData = Pool15MinuteCandleData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new Pool15MinuteCandleData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open0 = pool.token0Price;
    poolHourData.high0 = pool.token0Price;
    poolHourData.low0 = pool.token0Price;
    poolHourData.close0 = pool.token0Price;
    poolHourData.open1 = pool.token1Price;
    poolHourData.high1 = pool.token1Price;
    poolHourData.low1 = pool.token1Price;
    poolHourData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolHourData.high0)) {
    poolHourData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low0)) {
    poolHourData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolHourData.high1)) {
    poolHourData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolHourData.low1)) {
    poolHourData.low1 = pool.token1Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close0 = pool.token0Price;
  poolHourData.close1 = pool.token1Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as Pool15MinuteCandleData;
}

export function updatePool30MinuteData(event: ethereum.Event): Pool30MinuteCandleData {
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 30 / 60; // get unique hour within unix history
  let hourStartUnix = hourIndex * 30 * 60; // want the rounded effect
  // let hourPoolID = event.address.toHexString().concat("-").concat(hourIndex.toString());
  let pool = Pool.load(event.address.toHexString());
  let hourPoolID = pool.token0.concat(pool.token1).concat("-").concat(hourIndex.toString());
  let poolHourData = Pool30MinuteCandleData.load(hourPoolID);
  if (poolHourData === null) {
    poolHourData = new Pool30MinuteCandleData(hourPoolID);
    poolHourData.periodStartUnix = hourStartUnix;
    poolHourData.pool = pool.id;
    // things that dont get initialized always
    poolHourData.volumeToken0 = ZERO_BD;
    poolHourData.volumeToken1 = ZERO_BD;
    poolHourData.volumeUSD = ZERO_BD;
    poolHourData.txCount = ZERO_BI;
    poolHourData.feesUSD = ZERO_BD;
    poolHourData.protocolFeesUSD = ZERO_BD;
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI;
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI;
    poolHourData.open0 = pool.token0Price;
    poolHourData.high0 = pool.token0Price;
    poolHourData.low0 = pool.token0Price;
    poolHourData.close0 = pool.token1Price;
    poolHourData.open1 = pool.token1Price;
    poolHourData.high1 = pool.token1Price;
    poolHourData.low1 = pool.token1Price;
    poolHourData.close1 = pool.token1Price;
  }

  if (pool.token0Price.gt(poolHourData.high0)) {
    poolHourData.high0 = pool.token0Price;
  }
  if (pool.token0Price.lt(poolHourData.low0)) {
    poolHourData.low0 = pool.token0Price;
  }

  if (pool.token1Price.gt(poolHourData.high1)) {
    poolHourData.high1 = pool.token1Price;
  }
  if (pool.token1Price.lt(poolHourData.low1)) {
    poolHourData.low1 = pool.token1Price;
  }

  poolHourData.liquidity = pool.liquidity;
  poolHourData.sqrtPrice = pool.sqrtPrice;
  poolHourData.token0Price = pool.token0Price;
  poolHourData.token1Price = pool.token1Price;
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128;
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128;
  poolHourData.close0 = pool.token0Price;
  poolHourData.close1 = pool.token1Price;
  poolHourData.tick = pool.tick;
  poolHourData.tvlUSD = pool.totalValueLockedUSD;
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI);
  poolHourData.save();

  // test
  return poolHourData as Pool30MinuteCandleData;
}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
  let bundle = Bundle.load("1");
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let tokenDayID = token.id.toString().concat("-").concat(dayID.toString());
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  let tokenDayData = TokenDayData.load(tokenDayID);
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID);
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    tokenDayData.volume = ZERO_BD;
    tokenDayData.volumeUSD = ZERO_BD;
    tokenDayData.feesUSD = ZERO_BD;
    tokenDayData.protocolFeesUSD = ZERO_BD;
    tokenDayData.untrackedVolumeUSD = ZERO_BD;
    tokenDayData.open = tokenPrice;
    tokenDayData.high = tokenPrice;
    tokenDayData.low = tokenPrice;
    tokenDayData.close = tokenPrice;
  }

  if (tokenPrice.gt(tokenDayData.high)) {
    tokenDayData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenDayData.low)) {
    tokenDayData.low = tokenPrice;
  }

  tokenDayData.close = tokenPrice;
  tokenDayData.priceUSD = token.derivedETH.times(bundle.ethPriceUSD);
  tokenDayData.totalValueLocked = token.totalValueLocked;
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenDayData.save();

  return tokenDayData as TokenDayData;
}

export function updateTokenHourData(token: Token, event: ethereum.Event): TokenHourData {
  let bundle = Bundle.load("1");
  let timestamp = event.block.timestamp.toI32();
  let hourIndex = timestamp / 3600; // get unique hour within unix history
  let hourStartUnix = hourIndex * 3600; // want the rounded effect
  let tokenHourID = token.id.toString().concat("-").concat(hourIndex.toString());
  let tokenHourData = TokenHourData.load(tokenHourID);
  let tokenPrice = token.derivedETH.times(bundle.ethPriceUSD);

  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(tokenHourID);
    tokenHourData.periodStartUnix = hourStartUnix;
    tokenHourData.token = token.id;
    tokenHourData.volume = ZERO_BD;
    tokenHourData.volumeUSD = ZERO_BD;
    tokenHourData.untrackedVolumeUSD = ZERO_BD;
    tokenHourData.feesUSD = ZERO_BD;
    tokenHourData.protocolFeesUSD = ZERO_BD;
    tokenHourData.open = tokenPrice;
    tokenHourData.high = tokenPrice;
    tokenHourData.low = tokenPrice;
    tokenHourData.close = tokenPrice;
  }

  if (tokenPrice.gt(tokenHourData.high)) {
    tokenHourData.high = tokenPrice;
  }

  if (tokenPrice.lt(tokenHourData.low)) {
    tokenHourData.low = tokenPrice;
  }

  tokenHourData.close = tokenPrice;
  tokenHourData.priceUSD = tokenPrice;
  tokenHourData.totalValueLocked = token.totalValueLocked;
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD;
  tokenHourData.save();

  return tokenHourData as TokenHourData;
}

export function updateTickDayData(tick: Tick, event: ethereum.Event): TickDayData {
  let timestamp = event.block.timestamp.toI32();
  let dayID = timestamp / 86400;
  let dayStartTimestamp = dayID * 86400;
  let tickDayDataID = tick.id.concat("-").concat(dayID.toString());
  let tickDayData = TickDayData.load(tickDayDataID);
  if (tickDayData === null) {
    tickDayData = new TickDayData(tickDayDataID);
    tickDayData.date = dayStartTimestamp;
    tickDayData.pool = tick.pool;
    tickDayData.tick = tick.id;
  }
  tickDayData.liquidityGross = tick.liquidityGross;
  tickDayData.liquidityNet = tick.liquidityNet;
  tickDayData.volumeToken0 = tick.volumeToken0;
  tickDayData.volumeToken1 = tick.volumeToken0;
  tickDayData.volumeUSD = tick.volumeUSD;
  tickDayData.feesUSD = tick.feesUSD;
  tickDayData.feeGrowthOutside0X128 = tick.feeGrowthOutside0X128;
  tickDayData.feeGrowthOutside1X128 = tick.feeGrowthOutside1X128;

  tickDayData.save();

  return tickDayData as TickDayData;
}
