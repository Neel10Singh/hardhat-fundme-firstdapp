const { run } = require("hardhat")

async function verify(contractAddress, args) {
    console.log("Verifying Contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already been verified")) {
            console.log("Already verified!")
        } else {
            console.error(error)
        }
    }
}

module.exports = { verify }
