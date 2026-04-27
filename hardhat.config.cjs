require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    amoy: {
      url: process.env.BLOCKCHAIN_RPC_URL || "",
      accounts: process.env.BLOCKCHAIN_PRIVATE_KEY && process.env.BLOCKCHAIN_PRIVATE_KEY.length === 66 
        ? [process.env.BLOCKCHAIN_PRIVATE_KEY] 
        : [],
    },
  },
};
