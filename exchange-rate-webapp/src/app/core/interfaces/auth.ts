export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  lastname: string;
  username: string;
  password: string;
}
