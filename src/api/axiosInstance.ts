import axios from "axios";
import { refreshToken } from "@/api/auth";
import { handleApiError } from "@/api/errorHandler";
import {
  deleteLocalStorage,
  getLocalStorage,
} from "@/utils/localStorageHandler";

const BASE_URL = "https://frontend-test-be.stage.thinkeasy.cz";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Secure API Request Helper
 * Handles authenticated API calls, refresh token logic, and error handling.
 */
export const secureApiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data: any = null,
  authToken: string | null,
  getRefreshToken: () => string | null,
  setAuthToken: (token: string | null) => void,
  setRefreshToken: (token: string | null) => void,
): Promise<T> => {
  const headers: Record<string, string> = {};
  try {
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    //@ts-ignore
    const response = await axiosInstance.request<T>({
      url: endpoint,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const {
          accessToken: accessTokenValue,
          refreshToken: refreshTokenValue,
        } = getLocalStorage();
        // Use the refresh token to get a new access token

        if (!accessTokenValue) {
          throw "You have been logged out";
        }
        if (!refreshTokenValue) {
          throw "Failed to get refresh token";
        }

        const refreshedData = await refreshToken({
          authToken: accessTokenValue,
          token: refreshTokenValue,
        });

        setAuthToken(refreshedData.access_token);

        // Retry the original request with the new access token
        const retryResponse = await axiosInstance.request<T>({
          url: endpoint,
          method,
          data,
          headers: {
            ...headers,
            Authorization: `Bearer ${refreshedData.access_token}`,
          },
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.warn("Token refresh failed:", refreshError);

        // Handle failed refresh by logging out the user
        setAuthToken(null);
        setRefreshToken(null);
        deleteLocalStorage();
        sessionStorage.setItem("userHasBeenLoggedOut", "true");
        window.location.href = "/auth";
        throw refreshError;
      }
    }

    handleApiError(error);
  }
};

export default axiosInstance;
