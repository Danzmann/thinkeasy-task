import React from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { authTokenState } from "@/state/atoms";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const authToken = useRecoilValue(authTokenState);

    useEffect(() => {
      if (!authToken) {
        router.replace("/auth");
      }
    }, [authToken, router]);

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
