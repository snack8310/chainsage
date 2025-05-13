import { API_CONFIG } from './config';

export interface LoginResponse {
  username: string;
  message: string;
}

// Mock user database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

export const mockAuthService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      username: user.username,
      message: 'Login successful (Mock)',
    };
  },
}; 