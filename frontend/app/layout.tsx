import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Web3SignerContextProvider } from "@/context/web3.context";
import { AppMenu } from "@/components/common/AppMenu";

export const metadata: Metadata = {
  title: "Blockchain Sample App",
  description:
    "This is a sample app that demonstrates Web3 Blockchain features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Web3SignerContextProvider>
            <AppMenu>{children}</AppMenu>
          </Web3SignerContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
