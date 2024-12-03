import axiosInstance from "@/api/axiosInstance";
import { handleApiError } from "@/api/errorHandler";
import { SignupInput, LoginInput, Auth, RefreshTokenInput } from "@/types/api";

export async function signup(input: SignupInput): Promise<Auth> {
  try {
    const response = await axiosInstance.post("/auth/signup", input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function login(input: LoginInput): Promise<Auth> {
  try {
    const response = await axiosInstance.post("/auth/login", input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function refreshToken(
  input: RefreshTokenInput,
): Promise<{ access_token: string }> {
  try {
    const response = await axiosInstance.post(
      "/auth/refresh-token",
      {
        token: input.token,
      },
      {
        headers: {
          Authorization: `Bearer ${input.authToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
