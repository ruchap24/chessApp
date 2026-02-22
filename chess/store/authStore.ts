import { create } from 'zustand';
import api from '../services/api';
import { TokenStorage } from '../services/tokenStorage';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  initialize: async () => {
    const token = await TokenStorage.get();
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        set({ user: data.user });
      } catch {
        await TokenStorage.delete();
      }
    }
    set({ isLoading: false });
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await TokenStorage.save(data.token);
    set({ user: data.user });
  },

  logout: async () => {
    await TokenStorage.delete();
    set({ user: null });
  },
}));