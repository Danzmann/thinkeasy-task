import { atom } from "recoil";
import { Post, UserInfo } from "@/types/types";

export const authTokenState = atom<string | null>({
  key: "authTokenState",
  default: null,
});

export const refreshTokenState = atom<string | null>({
  key: "refreshTokenState",
  default: null,
});

export const userInfoState = atom<UserInfo>({
  key: "userInfoState",
  default: { email: null },
});

export const postsState = atom<Post[]>({
  key: "postsState",
  default: [],
});

export const currentUserPostsState = atom<Post[]>({
  key: "currentUserPostsState",
  default: [],
});
