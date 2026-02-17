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

    useEffect(() => {
    const initKeycloak = async () => {
        const kc = new Keycloak({
        url: "http://localhost:8443",
        realm: "movie-realm",
        clientId: "movie-frontend",
        });

        try {
        const authenticated = await kc.init({ 
            onLoad: "check-sso",
            silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" 
        });

        if (authenticated) {
            if (kc.token) {
            localStorage.setItem('token', kc.token);
            setToken(kc.token);
            }

            const roles = kc.realmAccess?.roles || [];
            const isAdmin = roles.includes("admin");

            setUser({
            username: kc.tokenParsed?.preferred_username || "User",
            role: isAdmin ? "admin" : "user",
            });
        }
        } catch (error) {
        console.error("Keycloak init error:", error);
        } finally {
        setIsLoading(false);
        keycloakRef.current = kc;
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