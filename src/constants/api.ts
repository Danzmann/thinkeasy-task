export const ENDPOINTS = {
  posts: "/posts",
  postById: (id: string) => `/posts/${id}`,
  postsByUser: (authorId: string) => `/posts/user/${authorId}`,
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refreshToken: "/auth/refresh-token",
  },
};

export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};
