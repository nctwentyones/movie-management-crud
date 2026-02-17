"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

interface User {
  username: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);
  const keycloakRef = useRef<Keycloak | null>(null);
  const isInitialized = useRef(false);

    useEffect(() => {
  if (isInitialized.current) return;
  isInitialized.current = true;

  const initKeycloak = async () => {
    const kc = new Keycloak({
      url: "http://localhost:8443", 
      realm: "movie-realm",
      clientId: "movie-frontend",
    });

    try {
      // WAJIB: Aktifkan onLoad: 'check-sso'
      const authenticated = await kc.init({ 
        onLoad: 'check-sso',
        pkceMethod: 'S256', 
        checkLoginIframe: false,
        // Gunakan redirectUri eksplisit agar tidak bingung saat callback
        redirectUri: window.location.origin 
      });

      if (authenticated) {
        setToken(kc.token);
        localStorage.setItem('token', kc.token || "");
        const roles = kc.realmAccess?.roles || [];
        setUser({
          username: kc.tokenParsed?.preferred_username || "User",
          role: roles.includes("admin") ? "admin" : "user",
        });
      } else {
        setIsLoading(false); 
      }
    } catch (error) {
      console.error("Keycloak init error:", error);
      setIsLoading(false);
    } finally {
      keycloakRef.current = kc;
      setIsLoading(false);
    }
  };

  initKeycloak();
}, []);

  const login = () => keycloakRef.current?.login();
  const logout = () => {
    localStorage.removeItem('token');
    keycloakRef.current?.logout({ redirectUri: window.location.origin });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};