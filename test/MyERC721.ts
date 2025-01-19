import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721Enumerable__factory } from "../typechain-types";
import { erc721 } from "../typechain-types/@openzeppelin/contracts/token";

async function deployFixture() {
  const [owner, account1] = await ethers.getSigners();
  const MyERC721Factory = await ethers.getContractFactory("MyERC721");
  const MyERC721 = await MyERC721Factory.deploy("TestNFT", "MYNFT");

  return { MyERC721, owner, account1 };
}

describe("MyERC721を作成するテスト", () => {
  it("初期流通量は0", async () => {
    const { MyERC721, account1 } = await loadFixture(deployFixture);
    // アカウントによるトランザクション発行
    await MyERC721.safeMint(account1.address, "https://example.com/nft1.json");
    // account1が保有するＮＦＴが１つ増えていることを確認
    expect(await MyERC721.balanceOf(account1.address)).to.equal(1);
    // NFTコントラクト全体でも作成されたＮＦＴ送料が１つ増えていることを確認
    expect(await MyERC721.totalSupply()).to.equal(1);
  });

  it("account1からは作成できないことの確認", async () => {
    const { MyERC721, account1 } = await loadFixture(deployFixture);
    await expect(
      MyERC721.connect(account1).safeMint(
        account1.address,
        "https://example.com/nft1.json"
      )
    ).to.be.revertedWith(/AccessControl: account .* is missing role .*/);
  });

  it("MyERC721をtransferするテスト", async () => {
    const { MyERC721, owner, account1 } = await loadFixture(deployFixture);
    const txResp = await MyERC721.safeMint(
      account1.address,
      "https://example.com/nft1.json"
    );
    const logs = await MyERC721.queryFilter(MyERC721.filters.Transfer());
    const tokenId = logs.find((log) => log.transactionHash === txResp.hash)!
      .args[2];
    await MyERC721.connect(account1).transferFrom(
      account1.address,
      owner.address,
      tokenId
    );
  });
});
