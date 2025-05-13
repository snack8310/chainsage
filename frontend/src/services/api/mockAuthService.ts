import { AuthService, LoginRequest, LoginResponse } from './types';

// Mock user database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
];

export class MockAuthService implements AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = MOCK_USERS.find(
      (u) => u.username === request.username && u.password === request.password
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return {
      username: user.username,
      message: 'Login successful (Mock)',
    };
  }
} 