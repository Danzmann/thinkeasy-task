import { useRecoilValue, useSetRecoilState } from "recoil";
import { authTokenState, refreshTokenState } from "@/state/atoms";
import { secureApiRequest } from "@/api/axiosInstance";

export const useApi = () => {
  const authToken = useRecoilValue(authTokenState);
  const getRefreshToken = () => useRecoilValue(refreshTokenState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  const apiCall = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data: any = null
  ): Promise<T> => {
    return secureApiRequest<T>(
      endpoint,
      method,
      data,
      authToken,
      getRefreshToken,
      setAuthToken,
      setRefreshToken,
    );
  };

  return { apiCall };
};
