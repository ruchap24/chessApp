import * as SecureStore from 'expo-secure-store';

export const TokenStorage = {
  async save(token: string) {
    await SecureStore.setItemAsync('jwt_token', token);
  },
  async get(): Promise<string | null> {
    return await SecureStore.getItemAsync('jwt_token');
  },
  async delete() {
    await SecureStore.deleteItemAsync('jwt_token');
  },
};