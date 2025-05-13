import { API_CONFIG } from '../config';
import { AuthService } from './types';
import { MockAuthService } from './mockAuthService';

export class ApiFactory {
  private static instance: ApiFactory;
  private authService: AuthService;

  private constructor() {
    this.authService = new MockAuthService();
  }

  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public getAuthService(): AuthService {
    return this.authService;
  }
} 