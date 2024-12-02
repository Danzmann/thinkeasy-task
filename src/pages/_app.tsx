import { useEffect } from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";

import { geistSans, geistMono } from "@/theme/fonts";
import { authTokenState, refreshTokenState } from "@/state/atoms";

import { useRouter } from "next/router";
import Header from "@/components/Header";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const AppInitializer = () => {
  const authToken = useRecoilValue(authTokenState);
  const refreshToken = useRecoilValue(refreshTokenState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  useEffect(() => {
    // :todo This is redundant since the refresh-token requires access token for some reason, but anyway it is here
    // Hydrate Recoil state with refresh token from localStorage
    const localRefreshToken = localStorage.getItem("refreshToken");
    if (localRefreshToken) {
      console.log("refresh:");
      console.log(localRefreshToken);
      setRefreshToken(localRefreshToken);

      // Attempt to refresh the access token on app load
      /*axiosInstance
        .post("/auth/refresh-token", { token: refreshToken })
        .then((response) => {
          setAuthToken(response.data.access_token);
        })
        .catch((error) => {
          console.log("Failed to refresh token:", error);
          localStorage.removeItem("refreshToken");
          setRefreshToken(null);
        });*/
    }
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
