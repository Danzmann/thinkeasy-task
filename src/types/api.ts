export interface SignupInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
}
