"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import artifact from "../abi/MyToken.sol/MyToken.json";

const contractAddress = process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS as string;

export default function Home() {
  const [windowEthereum, setWindowEthereum] = useState();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const { ethereum } = window as any;
    setWindowEthereum(ethereum);
  }, []);
  const handleButtonClick = async () => {
    if (windowEthereum) {
      const provider = new ethers.BrowserProvider(windowEthereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        provider
      );
      const walletAddress = await signer.getAddress();
      const balance = await contract.balanceOf(walletAddress);
      setInputValue(balance.toString());
    }
  };

  return (
    <div>
      <h1>Blockchain sample app</h1>
      <button onClick={handleButtonClick}>Tokens owned</button>
      <input type="text" value={inputValue} readOnly />
    </div>
  );
}
