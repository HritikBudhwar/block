// async function main() {
//   const initialSupply = ethers.utils.parseUnits("1000", 18); // Adjust the value and decimals as needed
//   const Token = await ethers.getContractFactory("Token");
//   const token = await Token.deploy(initialSupply); // Pass the argument here
//   await token.deployed();
//   console.log(`✅ Token deployed to: ${token.address}`);
// }



// const hre = require("hardhat");

// async function main() {
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("📤 Deploying contract with account:", deployer.address);

//   // Optional: show balance before deployment
//   const balance = await deployer.getBalance();
//   console.log("💰 Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

//   // Deploy contract
//   const initialSupply = hre.ethers.utils.parseUnits("1000", 18);
//   const Token = await hre.ethers.getContractFactory("Token");
//   const token = await Token.deploy(initialSupply);

//   await token.deployed();

//   console.log("✅ Token deployed to:", token.address);
// }

// main().catch((error) => {
//   console.error("❌ Deployment failed:", error);
//   process.exitCode = 1;
// });

const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("Token"); // ✅ CORRECT NAME
  const token = await Token.deploy(1000000); // ✅ Pass the initial supply

  await token.waitForDeployment();

  console.log("✅ Contract deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
