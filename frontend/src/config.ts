export const API_CONFIG = {
  baseURL: process.env.API_URL || 'http://localhost:8000',
  endpoints: {
    auth: '/api/v1/token',
  },
}; 