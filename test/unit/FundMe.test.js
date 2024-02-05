const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let MockV3Aggregator
    const sendValue = ethers.parseEther("1")
    beforeEach(async function () {
        //const accounts = ether.getSigners()
        deployer = (await getNamedAccounts()).deployer
        const deploymentResults = await deployments.fixture(["all"]) //will run all deploy scripts of whose tags are mentioned here
        const fundMeAddress = deploymentResults["FundMe"]?.address
        fundMe = await ethers.getContractAt("FundMe", fundMeAddress)
        const mockV3AggregatorAddress =
            deploymentResults["MockV3Aggregator"]?.address
        MockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            mockV3AggregatorAddress
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.getPriceFeed()
            const mockV3AggregatorAddress = await MockV3Aggregator.getAddress()
            assert.equal(response, mockV3AggregatorAddress)
        })
    })

    describe("fund", async function () {
        it("fails if not enough eth sent", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("Updates amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddresstoAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Updates funders data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })

    describe("withdarw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw eth from a single founder", async function () {
            //Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait(1)

            const { gasUsed, gasPrice } = transactionReciept
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Assert

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )
        })

        it("allows us to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnected = await fundMe.connect(accounts[i])
                await fundMeConnected.fund({ value: sendValue })
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReciept
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddresstoAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("only allows owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            // const attacker = accounts[1]
            const fundMeConnected = await fundMe.connect(accounts[1])
            await expect(
                fundMeConnected.withdraw()
            ).to.be.revertedWithCustomError(fundMeConnected, "FundMe__NotOwner")
        })
    })
    describe("cheaperWithdarw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("cheaper withdraw eth from a single founder", async function () {
            //Arrange
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReciept = await transactionResponse.wait(1)

            const { gasUsed, gasPrice } = transactionReciept
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            //Assert

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )
        })

        it("allows us to cheaper withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnected = await fundMe.connect(accounts[i])
                await fundMeConnected.fund({ value: sendValue })
            }
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReciept = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReciept
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance).toString(),
                (endingDeployerBalance + gasCost).toString()
            )

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddresstoAmountFunded(accounts[i].address),
                    0
                )
            }
        })

        it("only allows owner to cheap withdraw", async function () {
            const accounts = await ethers.getSigners()
            // const attacker = accounts[1]
            const fundMeConnected = await fundMe.connect(accounts[1])
            await expect(
                fundMeConnected.cheaperWithdraw()
            ).to.be.revertedWithCustomError(fundMeConnected, "FundMe__NotOwner")
        })
    })
})
