export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  message: string;
}

export interface AuthService {
  login(request: LoginRequest): Promise<LoginResponse>;
} 