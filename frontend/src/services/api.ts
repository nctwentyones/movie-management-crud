import axios from 'axios';
import { Media } from '@/types/media'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    // Changed path from /series to /movies
    const response = await api.post<Media>('/api/admin/movies', data);
    return response.data;
  },
  
  update: async (id: number, data: Partial<Media>) => {
    const response = await api.put<Media>(`/api/admin/movies/${id}`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    // Removed the undefined 'data' variable
    await api.delete(`/api/admin/movies/${id}`);
  },
};

export const seriesService = {
  // Mendapatkan semua series (Public)
  getAll: async () => {
    const response = await api.get<Media[]>('/api/series'); // Sesuaikan path jika di backend berubah
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Media>(`/api/series/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Media>) => {
    const response = await api.post<Media>('/api/admin/series', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Media>) => {
    const response = await api.put<Media>(`/api/admin/series/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/api/admin/series/${id}`);
  },
};