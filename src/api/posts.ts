import axiosInstance from "./axiosInstance";
import { handleApiError } from "./errorHandler";

export const fetchPosts = async () => {
  try {
    const response = await axiosInstance.get("/posts");
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const fetchUserPosts = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/user/${userId}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const fetchPostById = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

export const createPost = async (data: { title: string; content: string }) => {
  try {
    const response = await axiosInstance.post("/posts", data);
    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};
