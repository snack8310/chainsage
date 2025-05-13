import { API_CONFIG } from '../config';
import { AuthService, LoginRequest, LoginResponse } from './types';

export class RealAuthService implements AuthService {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  }
} 