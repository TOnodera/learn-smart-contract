"use client";
import { Web3SignerContext } from "@/context/web3.context";
import { AppShell, Burger, Button, Flex, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconWallet } from "@tabler/icons-react";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { NavbarLinks } from "./NavbarLinks";

export function AppMenu({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const { signer, setSigner } = useContext(Web3SignerContext);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAddress() {
      if (signer) {
        const address = await signer.getAddress();
        setAccount(address);
      }
    }
    fetchAddress();
  }, [signer]);

  // ボタンを押下したときに実行される関数
  const handleButtonClick = async () => {
    const { ethereum } = window as any;
    if (ethereum) {
      const lProvider = new ethers.BrowserProvider(ethereum);
      const lSigner = await lProvider.getSigner();
      setSigner(lSigner);
    }
  };

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header style={{ padding: "5px" }}>
        <Flex
          mih={40}
          gap="sm"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title style={{ paddingLeft: "5px" }} order={1} size="h3">
            Sample App
          </Title>
          {signer ? (
            <Button
              radius="xl"
              variant="default"
              leftSection={<IconWallet />}
              style={{ marginLeft: "auto" }}
            >
              {account?.slice(0, 6) + "..." + account?.slice(-2)}
            </Button>
          ) : (
            <Button onClick={handleButtonClick} style={{ marginLeft: "auto" }}>
              Connect
            </Button>
          )}
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p={{ base: 5 }}>
        <NavbarLinks />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
