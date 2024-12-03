import React from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { authTokenState, appLoadingState } from "@/state/atoms";
import { Spinner, Box } from "@chakra-ui/react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const authToken = useRecoilValue(authTokenState);
    const appLoading = useRecoilValue(appLoadingState);

    useEffect(() => {
      if (!authToken && !appLoading) {
        router.replace("/auth");
      }
    }, [authToken]);

    // App loading is called during fetching credentials on app initialization (_app.tsx)
    if (appLoading) {
      return (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          zIndex="9999"
        >
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Box>
      );
    }

    if (!authToken) {
      // Prevent rendering the component while redirecting
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent?.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
