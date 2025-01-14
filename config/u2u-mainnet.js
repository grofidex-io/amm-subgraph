const NATIVE_ADDRESS = '0x885a7b899bdbf51eed883a23449bf8a09c184391'
const TESTU = '0x7e92fd2762ef0dfef284397d7684621f329a49ef'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "mainnet",
  wNativeAddress: NATIVE_ADDRESS,
  v3: {
    // WBNB-USDT 500
    wNativeStablePoolAddress: "0xe82a1e96a2036c2ad04987e4cec19ef7386b181c",
    stableIsToken0: true,
    factoryAddress: "0x0171ecefcda02d32df2d2b49d9056f8db143fd77",
    startBlock: 24110434,
    stableCoins: [
      TESTU,
    ],
    whitelistAddresses: [
      NATIVE_ADDRESS,
      TESTU,
    ],
    nonfungiblePositionManagerAddress: "0x9b54f529fb2b301690b058eb033eb78e59197438",
    nonfungiblePositionManagerStartBlock: 24110444,
    minETHLocked: 1,
  },
  masterChefV3: {
    masterChefAddress: "0x42bb2081a008c1dfc1f4fa6f7f7703a9021af506",
    startBlock: 24110457,
  },
  predictionV2: {
    startBlock: 10333825,
    address: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  },
};

