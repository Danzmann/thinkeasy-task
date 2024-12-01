import axios from "axios";
// import { authTokenState, refreshTokenState } from "@/state/atoms";
import { refreshToken } from "@/api/auth";
// import { RecoilState, RecoilValue, useSetRecoilState } from "recoil";

const BASE_URL = "https://frontend-test-be.stage.thinkeasy.cz/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupAxiosInterceptors = (
  getAuthToken: () => string | null,
  getRefreshToken: () => string | null,
  setAuthToken: (token: string | null) => void,
  setRefreshToken: (token: string | null) => void,
) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Access token expired (401), refresh access with refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshTokenValue = getRefreshToken();
          if (!refreshTokenValue) throw new Error("Refresh token missing");

          const refreshedData = await refreshToken({
            token: refreshTokenValue,
          });

          setAuthToken(refreshedData.access_token);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${refreshedData.access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          setAuthToken(null);
          setRefreshToken(null);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

export default axiosInstance;
