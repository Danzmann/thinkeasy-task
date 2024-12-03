import { useEffect } from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot, useSetRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";

import { geistSans, geistMono } from "@/theme/fonts";
import {
  appLoadingState,
  authTokenState,
  refreshTokenState,
  userInfoState,
} from "@/state/atoms";
import { refreshToken as getRefreshToken } from "@/api/auth";
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/utils/localStorageHandler";

import Header from "@/components/Header";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const AppInitializer = () => {
  const router = useRouter();
  const setAppLoading = useSetRecoilState(appLoadingState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const getAuthTokenState = useRecoilValue(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    // Hydrate Recoil state with refresh token from localStorage
    const {
      accessToken: localAuthToken,
      refreshToken: localRefreshToken,
      userInfo,
    } = getLocalStorage();

    if (localRefreshToken && localAuthToken) {
      setRefreshToken(localRefreshToken);

      setAppLoading(true);
      // Attempt to refresh the access token on app load
      getRefreshToken({ authToken: localAuthToken, token: localRefreshToken })
        .then((response) => {
          setAuthToken(response.access_token);
          setLocalStorage({ accessToken: response.access_token });
          // If the accessToken was in localStorage, userInfo will too
          setUserInfo({ email: userInfo || "" });
          setAppLoading(false);
          if (router.pathname.includes("/auth")) router.replace("/");
        })
        .catch((error) => {
          console.log("Failed to refresh token: ", error);
          deleteLocalStorage();
          setAppLoading(false);
          setRefreshToken(null);
          setAuthToken(null);
        });
    } else if (!getAuthTokenState) {
      deleteLocalStorage();
      setAppLoading(false);
      setRefreshToken(null);
      setAuthToken(null);
    } else {
      setAppLoading(false);
    }
  }, []);

  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleLogout = () => {
    deleteLocalStorage();
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
