import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "frontend/types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
  },
};

export default config;
