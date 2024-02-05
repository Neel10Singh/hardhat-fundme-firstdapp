require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")
require("@nomicfoundation/hardhat-ethers")
require("@typechain/hardhat")
require("hardhat-gas-reporter")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
const sepoliaURL = process.env.SEPOLIA_RPC_URL
const privateKey = process.env.PRIVATE_KEY
const etherscanApiKey = process.env.ETHERSCAN_API_KEY
const coinmarketKey = process.env.COINMARKET_API_KEY
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: sepoliaURL,
            accounts: [privateKey],
            chainId: 11155111,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: coinmarketKey,
        token: "ETH",
    },
    etherscan: {
        apiKey: etherscanApiKey,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    // solidity: "0.8.22",
    solidity: {
        compilers: [{ version: "0.8.22" }, { version: "0.6.6" }],
    },
}
