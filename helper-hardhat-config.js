const networkConfig = {
    11155111: {
        name: "sepolia",
        PriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}
const developmentChains = ["hardhat", "localhost"]
const decimals = 8
const initialAnswer = 200000000000
module.exports = { networkConfig, developmentChains, decimals, initialAnswer }
