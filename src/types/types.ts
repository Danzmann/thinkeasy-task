export interface UserInfo {
  email: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  authorId: string;
}
