const NATIVE_ADDRESS = '0x4b9f8077856d81c5e97948dbec8960024d4908c1'
const WBTC_ADDRESS = '0x5289638b40725fb3c33f801d1a339878674ff555'
const DAI_ADDRESS = '0x73fe4db0779022ff9c0b32ef2644272b32bef5b7'
const USDC_ADDRESS = '0x9a0359e8432c856e1eefc6f2e242b5dfed41b3ec'
const USDT_ADDRESS = '0xf13d179f157a6202cede6a78a197eacee656440a'
const SUSHI_ADDRESS = '0xd0c8ec558e16361064f3d1240d0e5472943ea340'
const WXRP_ADDRESS = '0xfd38a31834ccb29fa16c98b6c7a22283c3ceaba0'
const BUSD_ADDRESS = '0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0'
const XSUSHI_ADDRESS = '0xb7739ebf389dd3b647e15105c6465be975088d0d'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "testnet",
  wNativeAddress: NATIVE_ADDRESS,
  v3: {
    // WBNB-USDT 500
    wNativeStablePoolAddress: "0x8b8c0153a4367ec99c05294310e0191f8abffd0e",
    stableIsToken0: true,
    factoryAddress: "0x45e54eee844b41c204b6ffdd4c4c55311e270084",
    startBlock: 19538532,
    stableCoins: [
      USDC_ADDRESS,
      USDT_ADDRESS,
      DAI_ADDRESS,
      BUSD_ADDRESS
    ],
    whitelistAddresses: [
      NATIVE_ADDRESS,
      WBTC_ADDRESS,
      DAI_ADDRESS,
      USDC_ADDRESS,
      USDT_ADDRESS,
      XSUSHI_ADDRESS,
      SUSHI_ADDRESS,
      BUSD_ADDRESS,
      WXRP_ADDRESS
    ],
    nonfungiblePositionManagerAddress: "0xbcc3225c004ecf6411e7a69f41667e3b4f3ecb61",
    nonfungiblePositionManagerStartBlock: 19538542,
    minETHLocked: 1,
  },
  masterChefV3: {
    masterChefAddress: "0x7a7880f4A7465fB4075402E44168690959f99449",
    startBlock: 19538555,
  },
  predictionV2: {
    startBlock: 10333825,
    address: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  },
};

