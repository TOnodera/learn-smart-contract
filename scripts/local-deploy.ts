import { ethers } from "hardhat";

async function main() {
  const myToken = await ethers.deployContract("MyToken");
  myToken.waitForDeployment();
  console.log(`MyToken deployed to: ${myToken.target}`);

  // MyERC20のデプロイ
  const myERC20 = await ethers.deployContract("MyERC20");
  await myERC20.waitForDeployment();
  console.log(`MyERC20 deployed to: ${myERC20.target}`);

  // MyERC721をデプロイ
  const myERC721 = await ethers.deployContract("MyERC721", [
    "MyERC721",
    "MYERC721",
  ]);
  await myERC721.waitForDeployment();
  console.log(`MyERC20 deployed to: ${myERC721.target}`);

  // seaportのデプロイ
  const conduitController = await ethers.deployContract("ConduitController");
  await conduitController.waitForDeployment();
  const conduitControllerAddress = await conduitController.getAddress();
  const seaport = await ethers.deployContract("Seaport", [
    conduitControllerAddress,
  ]);
  await seaport.waitForDeployment();
  console.log(`Seaport deployed to: ${seaport.target}`);
}

main().catch(console.error);
