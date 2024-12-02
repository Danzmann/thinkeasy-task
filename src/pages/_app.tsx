import { useEffect } from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";

import { geistSans, geistMono } from "@/theme/fonts";
import {
  appLoadingState,
  authTokenState,
  refreshTokenState,
  userInfoState,
} from "@/state/atoms";
import { refreshToken as getRefreshToken } from "@/api/auth";

import Header from "@/components/Header";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const AppInitializer = () => {
  const router = useRouter();
  // const authToken = useRecoilValue(authTokenState);
  // const refreshToken = useRecoilValue(refreshTokenState);
  const setAppLoading = useSetRecoilState(appLoadingState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    // :todo This is redundant since the refresh-token requires access token for some reason, but anyway it is here
    // Hydrate Recoil state with refresh token from localStorage
    const localRefreshToken = localStorage.getItem("refreshToken");
    const localAuthToken = localStorage.getItem("accessToken");
    if (localRefreshToken && localAuthToken) {
      setRefreshToken(localRefreshToken);

      setAppLoading(true);
      // Attempt to refresh the access token on app load
      getRefreshToken({ authToken: localAuthToken, token: localRefreshToken })
        .then((response) => {
          setAuthToken(response.access_token);
          localStorage.setItem("accessToken", response.access_token);
          // If the accessToken was in localStorage, userInfo will too
          setUserInfo({ email: localStorage.getItem("userInfo") || "" });
          setAppLoading(false);
          router.replace("/");
        })
        .catch((error) => {
          console.log("Failed to refresh token: ", error);
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          setAppLoading(false);
          setRefreshToken(null);
        });
    } else {
      setAppLoading(false);
    }
  }, []);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/auth";
  };

  const isAuthPage = router.pathname === "/auth";

  return (
    <RecoilRoot>
      <ChakraProvider>
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
