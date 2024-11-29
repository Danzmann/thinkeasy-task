declare global {
  type ApiResponse<T> = {
    data: T;
    status: string;
    message?: string;
  };
}

export {};
