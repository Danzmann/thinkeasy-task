import { useRecoilValue, useSetRecoilState } from "recoil";
import { authTokenState, refreshTokenState } from "@/state/atoms";
import { secureApiRequest } from "@/api/axiosInstance";
import { NewPost } from "@/types/types";

export const useApi = () => {
  const authToken = useRecoilValue(authTokenState);
  const getRefreshToken = () => useRecoilValue(refreshTokenState);
  const setAuthToken = useSetRecoilState(authTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  const apiCall = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data: NewPost | null = null
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
