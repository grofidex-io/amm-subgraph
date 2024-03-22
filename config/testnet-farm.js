const NATIVE_ADDRESS = '0x33dbb072e53cf0dd0fd55b19ffdb4e794364d666'
const WBTC_ADDRESS = '0x9a599da01fd5193ca5060d7eae650889b18e5e64'
const WETH_ADDRESS = '0x0a3c7baf490d9f5d77412051cbdf0a11ae7f6950'
const DAI_ADDRESS = '0x73fe4db0779022ff9c0b32ef2644272b32bef5b7'
const USDT_ADDRESS = '0x5b14303c782635acfdcfc9ceab251b369ece68c9'
const WBNB_ADDRESS = '0x2ab42afc0e59fad4faebea40321479a9fb6440b9'
const WXRP_ADDRESS = '0xfd38a31834ccb29fa16c98b6c7a22283c3ceaba0'
const BUSD_ADDRESS = '0xc845fc63a5a69637ebe0d960fbfa33671a1e21e0'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "testnet",
  wNativeAddress: NATIVE_ADDRESS,
  v3: {
    // WBNB-USDT 500
    wNativeStablePoolAddress: "0x6b9a3ed386efe88754939ea344be168a6252bc66",
    stableIsToken0: true,
    factoryAddress: "0xd85086fb4b265508300224ddc26db8d636a6b280",
    startBlock: 19566624,
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
      WETH_ADDRESS
    ],
    nonfungiblePositionManagerAddress: "0x7cfaacb83be5326ecadeedfcde7850ee13d109c6",
    nonfungiblePositionManagerStartBlock: 19566636,
    minETHLocked: 1,
  },
  masterChefV3: {
    masterChefAddress: "0x73849a2e581a32e326ac3236f448f5ea17e6da41",
    startBlock: 19566655,
  },
  predictionV2: {
    startBlock: 10333825,
    address: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  },
};

