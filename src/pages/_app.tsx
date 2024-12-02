import { useEffect } from "react";
import { AppProps } from "next/app";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";

import { geistSans, geistMono } from "@/theme/fonts";
import axiosInstance, { setupAxiosInterceptors } from "@/api/axiosInstance";
import { authTokenState, refreshTokenState } from "@/state/atoms";

import "../styles/globals.css";
import { useRouter } from "next/router";
import Header from "@/components/Header";

const AppInitializer = () => {
  const getAuthToken = useRecoilValue(authTokenState);
  const getRefreshToken = useRecoilValue(refreshTokenState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  useEffect(() => {
    // :todo This is redundant since the refresh-token requires access token for some reason, but anyway it is here
    // Hydrate Recoil state with refresh token from localStorage
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      console.log("refresh:");
      console.log(refreshToken);
      setRefreshToken(refreshToken);

      // Attempt to refresh the access token on app load
      axiosInstance
        .post("/auth/refresh-token", { token: refreshToken })
        .then((response) => {
          setAuthToken(response.data.access_token);
        })
        .catch((error) => {
          console.log("Failed to refresh token:", error);
          localStorage.removeItem("refreshToken");
          setRefreshToken(null);
        });
    }

    // Initialize Axios interceptors
    setupAxiosInterceptors(
      () => getAuthToken,
      () => getRefreshToken,
      setAuthToken,
      setRefreshToken,
    );
  }, []);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth";
  };

  const isAuthPage = router.pathname === "/auth";

  return (
    <RecoilRoot>
      <ChakraProvider value={defaultSystem}>
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AppInitializer />
          {!isAuthPage && <Header onLogout={handleLogout} />}
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
