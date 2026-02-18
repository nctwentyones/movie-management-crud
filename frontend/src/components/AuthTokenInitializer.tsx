"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { setAuthToken } from '@/services/api';

export default function AuthTokenInitializer() {
  const { token, isAuthenticated  } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      setAuthToken(token);
      localStorage.setItem('token', token);
      console.log("Token synced to Axios & LocalStorage");
    } else {
      setAuthToken(null);
      localStorage.removeItem('token');
    }
  }, [token, isAuthenticated]); 

  return null;
} 