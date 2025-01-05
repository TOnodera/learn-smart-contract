
import {expect} from 'chai'
import { ethers } from 'hardhat'


describe("MyToken contract", ()=>{
    it("トークンの全供給量を所有者に割り当てる", async ()=>{
        const [owner] = await ethers.getSigners();
        const myToken = await ethers.deployContract("MyToken");
        const ownerBalance = await myToken.balanceOf(owner.address);
        expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });
});