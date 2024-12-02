import axiosInstance from "@/api/axiosInstance";
import { handleApiError } from "@/api/errorHandler";
import { SignupInput, LoginInput, Auth, RefreshTokenInput } from "@/types/api";

const BASE_URL = "https://frontend-test-be.stage.thinkeasy.cz/auth";

export async function signup(input: SignupInput): Promise<Auth> {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/signup`, input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function login(input: LoginInput): Promise<Auth> {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/login`, input);
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
      `${BASE_URL}/refresh-token`,
      input,
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
