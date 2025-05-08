// const NATIVE_ADDRESS = '0x885a7b899bdbf51eed883a23449bf8a09c184391'
const NATIVE_ADDRESS = '0xa99cf32e9aaa700f9e881ba9bf2c57a211ae94df'
// const TESTU = '0x7e92fd2762ef0dfef284397d7684621f329a49ef'
const USDT = '0x0820957b320e901622385cc6c4fca196b20b939f'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "mainnet",
  wNativeAddress: NATIVE_ADDRESS,
  v3: {
    // WBNB-USDT 500
    wNativeStablePoolAddress: "0x6fec532983365f33dc70a0499f047f8f2178c671",
    stableIsToken0: true,
    factoryAddress: "0xb13b63b880f8c9b39cb68ed3fdfe10f067cf76cb",
    startBlock: 29477014,
    stableCoins: [
      USDT,
    ],
    whitelistAddresses: [
      NATIVE_ADDRESS,
      USDT,
    ],
    nonfungiblePositionManagerAddress: "0xd303a176836a7179d018344396ea05cb94b05769",
    nonfungiblePositionManagerStartBlock: 29477029,
    minETHLocked: 1,
  },
  masterChefV3: {
    masterChefAddress: "0xa12b914ca7580be0d81a45704aa5fee833772651",
    startBlock: 29477037,
  },
  predictionV2: {
    startBlock: 10333825,
    address: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  },
};

