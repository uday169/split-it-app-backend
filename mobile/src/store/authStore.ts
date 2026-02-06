import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const authStore = {
  setToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  removeToken: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  setUser: async (user: any) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  getUser: async () => {
    const user = await SecureStore.getItemAsync(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  removeUser: async () => {
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  clearAll: async () => {
    await authStore.removeToken();
    await authStore.removeUser();
  },
};

// Export individual functions for convenience
export const { setToken, getToken, removeToken, setUser, getUser, removeUser, clearAll } = authStore;
