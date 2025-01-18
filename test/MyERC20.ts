import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyERC20 contract", () => {
  it("トークンの全供給量を所有者に割り当てる", async () => {
    const [owner] = await ethers.getSigners();
    const MyERC20 = await ethers.deployContract("MyERC20");
    const ownerBalance = await MyERC20.balanceOf(owner.address);
    expect(await MyERC20.totalSupply()).to.equal(ownerBalance);
  });
});
