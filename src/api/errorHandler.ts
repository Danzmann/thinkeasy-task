import axios from "axios";

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

export { handleApiError };
