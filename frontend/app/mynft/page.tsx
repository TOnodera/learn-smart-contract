"use client";

import { Web3SignerContext } from "@/context/web3.context";
import { ethers, isError } from "ethers";
import { useContext, useEffect, useRef, useState } from "react";
import { MyERC721, MyERC721__factory } from "@/types";
import CoinImage from "@/public/coin.jpg";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Modal,
} from "@mantine/core";
import { IconCubePlus } from "@tabler/icons-react";
import Image from "next/image";
import { Seaport } from "@opensea/seaport-js";
import { ethers as ethersv5 } from "ethersV5";
import { useDisclosure } from "@mantine/hooks";
import { ItemType } from "@opensea/seaport-js/lib/constants";
import { CreateOrderInput } from "@opensea/seaport-js/lib/types";

const contractAddress = process.env.NEXT_PUBLIC_APP_CONTRACT_ADDRESS!;
const seaportAddress = process.env.PUBLIC_NEXT_APP_SEAPORT_ADDRESS!;

type NFT = {
  tokenId: bigint;
  name: string;
  description: string;
  image: string;
};

export default function MyNFT() {
  const { signer } = useContext(Web3SignerContext);
  const [myERC721Contract, setMyERC721Contract] = useState<MyERC721 | null>(
    null
  );
  const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
  useEffect(() => {
    const fetchMyNFTs = async () => {
      const nfts = [];
      if (myERC721Contract && myERC721Contract.runner) {
        const myAddress = await signer?.getAddress()!;
        let balance = BigInt(0);
        try {
          balance = await myERC721Contract.balanceOf(myAddress);
        } catch (err) {
          if (isError(err, "BAD_DATA")) {
            balance = BigInt(0);
          } else {
            throw err;
          }
        }

        for (let i = 0; i < balance; i++) {
          const tokenId = await myERC721Contract.tokenOfOwnerByIndex(
            myAddress,
            i
          );
          const jsonMetaData = {
            name: `NFT #${tokenId}`,
            description: "explain this token",
            image: `https://source.unsplash.com/300x200?glass&s=${tokenId}`,
            tokenId,
          };
          nfts.push(jsonMetaData);
        }
        setMyNFTs(nfts);
      }
    };
    fetchMyNFTs();
  }, [myERC721Contract, signer]);

  useEffect(() => {
    const contract = MyERC721__factory.connect(contractAddress, signer);
    setMyERC721Contract(contract);

    const fillAddress = async () => {
      if (ref.current) {
        const myAddress = await signer?.getAddress();
        if (myAddress) {
          ref.current.value = myAddress;
        }
      }
    };
    fillAddress();
  }, [signer]);

  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const account = ref.current!.value;
      await myERC721Contract?.safeMint(account, "https://example.com/nft.json");
      setShowAlert(true);
      setAlertMessage(
        `NFT minted and sent to the wallet ${
          account?.slice(0, 6) + "..." + account?.slice(-2)
        }. Enjoy your NFT!`
      );
    } finally {
      setLoading(false);
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  /**
   * NFT売り注文
   */
  const [mySeaport, setMySeaport] = useState<Seaport | null>(null);

  useEffect(() => {
    const setupSeaport = async () => {
      if (signer) {
        const { ethereum } = window as any;
        const ethersV5Provider = new ethersv5.providers.Web3Provider(ethereum);
        const ethersV5Signer = await ethersV5Provider.getSigner();
        const lSeaport = new Seaport(ethersV5Signer, {
          overrides: {
            contractAddress: seaportAddress,
          },
        });
        setMySeaport(lSeaport);
      }
    };
    setupSeaport();
  }, [signer]);

  // 売り注文作成モーダルの表示コントロール
  const [opened, { open, close }] = useDisclosure();
  // NFT売却における価格データを保持する
  const refSellOrder = useRef<HTMLInputElement>(null);
  // NFT作成中のローディング
  const [loadingSellOrder, setLoadingSellOrder] = useState(false);
  // 売りに出すNFTのトークンIDを保持する
  const [sellTargetTokenId, setSellTargetTokenId] = useState<string | null>(
    null
  );

  // モーダルオープン
  const openModal = (tokenId: string) => {
    setSellTargetTokenId(tokenId);
    open();
  };

  // NFT売り注文作成処理
  const createSellOrder = async () => {
    try {
      setLoadingSellOrder(true);
      const price = refSellOrder.current!.value;
      const firstStandardCreatedOrderInput: CreateOrderInput = {
        offer: [
          {
            itemType: ItemType.ERC721,
            token: contractAddress,
            identifier: sellTargetTokenId!,
          },
        ],
        consideration: [
          {
            amount: ethers.parseUnits(price, "ether").toString(),
            recipient: await signer?.getAddress()!,
            token: ethers.ZeroAddress,
          },
        ],
      };
      // 売り注文作成
      const orderUseCase = await mySeaport!.createOrder(
        firstStandardCreatedOrderInput
      );
      const order = await orderUseCase.executeAllActions();
      console.log(order);
      setShowAlert(true);
      setAlertMessage(`NFT ${sellTargetTokenId} is now for sale`);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingSellOrder(false);
      setSellTargetTokenId(null);
      close();
    }
  };

  return (
    <div>
      <Title order={1} style={{ paddingBottom: 12 }}>
        My NFT Management
      </Title>
      {showAlert ? (
        <Container py={8}>
          <Alert
            variant="light"
            color="teal"
            title="NFT Minted Successfully"
            withCloseButton
            onClose={() => setShowAlert(false)}
            icon={<IconCubePlus />}
          >
            {alertMessage}
          </Alert>
        </Container>
      ) : null}

      <SimpleGrid cols={{ base: 1, sm: 3, lg: 5 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section>
            <Container py={12}>
              <Group justify="center">
                <Avatar color="blue" radius="xl">
                  <IconCubePlus size="1.5rem" />
                </Avatar>
                <Text fw={700}>Mint Your NFTs!</Text>
              </Group>
            </Container>
          </Card.Section>
          <Stack>
            <TextInput
              ref={ref}
              label="Wallet address"
              placeholder="0x0000..."
            />
            <Button loading={loading} onClick={handleButtonClick}>
              Mint NFT
            </Button>
          </Stack>
        </Card>
        {/** NFT 一覧*/}
        {myNFTs.map((nft, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src={CoinImage} height={160} alt="No image" />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{nft.name}</Text>
              <Badge color="blue" variant="light">
                tokenId: {nft.tokenId.toString()}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              {nft.description}
            </Text>
            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => openModal(nft.tokenId.toString())}
            >
              Sell this NFT
            </Button>
          </Card>
        ))}
      </SimpleGrid>
      <Modal opened={opened} onClose={close} title="Sell your NFT">
        <Stack>
          <TextInput
            ref={refSellOrder}
            label="Price (ether)"
            placeholder="10"
          />
          <Button loading={loadingSellOrder} onClick={createSellOrder}>
            Create sell order
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
