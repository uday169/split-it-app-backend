// Use environment variable for production, fallback to localhost for development
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
} as const;
