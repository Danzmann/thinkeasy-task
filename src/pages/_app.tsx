import { AppProps } from "next/app";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";

import { geistSans, geistMono } from "@/theme/fonts";
import { setupAxiosInterceptors } from "@/api/axiosInstance";
import { authTokenState, refreshTokenState } from "@/state/atoms";

import "../styles/globals.css";

function AppInitializer() {
  const getAuthToken = useRecoilValue(authTokenState);
  const getRefreshToken = useRecoilValue(refreshTokenState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  // Initialize Axios interceptors
  setupAxiosInterceptors(
    () => getAuthToken,
    () => getRefreshToken,
    setAuthToken,
    setRefreshToken,
  );

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider value={defaultSystem}>
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppInitializer />
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
