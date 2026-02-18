import axios from 'axios';
import { Media } from '@/types/media'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
const ADMIN_PREFIX = '/api/admin';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const genreService = {
  getAll: async () => {
    const response = await api.get('/genres');
    return response.data;
  },
};

// --- MOVIE SERVICE ---
export const movieService = {
  getAll: async () => {
    const response = await api.get<Media[]>('/movies');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Media>(`/movies/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Media>) => {
    const response = await api.post<Media>(`${ADMIN_PREFIX}/movies`, data);
    return response.data;
  },
  update: async (id: number, data: Partial<Media>) => {
    const response = await api.put<Media>(`${ADMIN_PREFIX}/movies/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`${ADMIN_PREFIX}/movies/${id}`);
  },
};

// --- SERIES SERVICE ---
export const seriesService = {
  // Public Routes
  getAll: async () => {
    const response = await api.get<Media[]>('/series'); 
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<Media>(`/series/${id}`);
    return response.data;
  },

  // Admin Routes
  create: async (data: Partial<Media>) => {
    const response = await api.post<Media>(`${ADMIN_PREFIX}/series`, data);
    return response.data;
  },
  update: async (id: number, data: Partial<Media>) => {
    const response = await api.put<Media>(`${ADMIN_PREFIX}/series/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`${ADMIN_PREFIX}/series/${id}`);
  },
};