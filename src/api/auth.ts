import axios from "axios";
import { SignupInput, LoginInput, Auth, RefreshTokenInput } from "@/types/api";

const BASE_URL = "https://frontend-test-be.stage.thinkeasy.cz/auth";

const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error?.response?.data?.message ||
      "Something went wrong. Please try again.";
    throw { status, message };
  }
  throw { status: 500, message: "An unexpected error occurred." };
};

export async function signup(input: SignupInput): Promise<Auth> {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function login(input: LoginInput): Promise<Auth> {
  try {
    const response = await axios.post(`${BASE_URL}/login`, input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function refreshToken(
  input: RefreshTokenInput,
): Promise<{ access_token: string }> {
  try {
    const response = await axios.post(`${BASE_URL}/refresh-token`, input);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}
