import { AppProps } from "next/app";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

import { geistSans, geistMono } from "@/theme/fonts";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider value={defaultSystem}>
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
