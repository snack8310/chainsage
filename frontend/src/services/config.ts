export const API_CONFIG = {
  baseURL: process.env.API_URL || 'http://localhost:8000',
  useMock: process.env.USE_MOCK === 'true',
  endpoints: {
    auth: {
      login: '/api/v1/login',
    },
  },
}; 