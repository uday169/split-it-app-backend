// Use environment variable for production, fallback to localhost for development
// Note for Android Emulator:
// - Use 'http://10.0.2.2:3000/api/v1' to connect to localhost:3000 on your development machine
// - The default 'http://localhost:3000' won't work in Android emulator
// - For physical devices, use your computer's IP address (e.g., 'http://192.168.1.100:3000/api/v1')
export const config = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
} as const;
