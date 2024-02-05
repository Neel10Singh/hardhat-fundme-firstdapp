const { network } = require("hardhat")
const {
    developmentChains,
    decimals,
    initialAnswer,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() //gets accounts from named Accounts in hardhat.config
    if (developmentChains.includes(network.name)) {
        log("local Network detected.. deploying mocks")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [decimals, initialAnswer],
        })
        log("Mocks deployed")
        log("__________________________________________________")
    }
}

module.exports.tags = ["all", "mocks"]
