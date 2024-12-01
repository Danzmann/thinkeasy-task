// Request payloads
export interface SignupInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// API responses
export interface Auth {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenInput {
  token: string;
}
