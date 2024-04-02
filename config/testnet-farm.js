const NATIVE_ADDRESS = '0xc5f15624b4256c1206e4bb93f2ccc9163a75b703'
const WBTC_ADDRESS = '0x4ebbe24182e9c14e1d2e02ab9459190f39c43b6f'
const WETH_ADDRESS = '0x94504f356a267f3a128c2e6387281bccdbd821a0'
const DAI_ADDRESS = '0x73fe4db0779022ff9c0b32ef2644272b32bef5b7'
const USDT_ADDRESS = '0xdfae88f8610a038afcdf47a5bc77c0963c65087c'
const WBNB_ADDRESS = '0x7bd3dc0e0e1e1ccce1657a18cbe32f13f9fc9376'
const WXRP_ADDRESS = '0xcedb8ee7c0e21bdd78f46e334a33ed17189131d5'
const BUSD_ADDRESS = '0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0'
const WSOL_ADDRESS = '0xa4447a108e92b8c36de0fb310d43f95c54fc81e2'
const WDOGE_ADDRESS = '0xf25394ebb6d132d21bce902f759f592954e898cd'
const WNEAR_ADDRESS = '0xfd7ea8beabf2999dcf7f97a694b7fda60ac4bf20'
const WADA_ADDRESS = '0xbeb74c0c2cc994c8fad7ba91fae15b5b748cd707'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "testnet",
  wNativeAddress: NATIVE_ADDRESS,
  v3: {
    // WBNB-USDT 500
    wNativeStablePoolAddress: "0xbbd2572cf5087a8cb2df152fe96fa870a23246f3",
    stableIsToken0: false,
    factoryAddress: "0xe33d310359dc645cafae5bd263499302ee66a740",
    startBlock: 20239918,
    stableCoins: [
      USDT_ADDRESS,
      DAI_ADDRESS,
      BUSD_ADDRESS
    ],
    whitelistAddresses: [
      NATIVE_ADDRESS,
      WBTC_ADDRESS,
      DAI_ADDRESS,
      USDT_ADDRESS,
      BUSD_ADDRESS,
      WXRP_ADDRESS,
      WBNB_ADDRESS,
      WETH_ADDRESS,
      WSOL_ADDRESS,
      WDOGE_ADDRESS,
      WNEAR_ADDRESS,
      WADA_ADDRESS
    ],
    nonfungiblePositionManagerAddress: "0x798b115d5fb4cbbd1708af6a16a77239c1005cae",
    nonfungiblePositionManagerStartBlock: 20239941,
    minETHLocked: 1,
  },
  masterChefV3: {
    masterChefAddress: "0x15ba022f1067aeba4d63813d9a62a863e6cf13c4",
    startBlock: 20239968,
  },
  predictionV2: {
    startBlock: 10333825,
    address: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  },
};

