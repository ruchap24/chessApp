import axios from 'axios';
import { TokenStorage } from './tokenStorage';

export const API_URL = 'https://your-backend.com/api'; 

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await TokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;