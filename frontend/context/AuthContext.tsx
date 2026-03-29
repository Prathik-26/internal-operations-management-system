"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "@/types";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialAuth(): {
  user: AuthUser | null;
  accessToken: string | null;
} {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null };
  }

  const token = localStorage.getItem("accessToken");
  if (!token) return { user: null, accessToken: null };

  try {
    const decoded = jwtDecode<{ sub: string; role: AuthUser["role"] }>(token);
    return {
      user: { userId: decoded.sub, role: decoded.role },
      accessToken: token,
    };
  } catch {
    localStorage.clear();
    return { user: null, accessToken: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, accessToken }, setAuth] = useState(getInitialAuth);
  const [isLoading] = useState(false);

  const login = (newAccessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", refreshToken);
    const decoded = jwtDecode<{ sub: string; role: AuthUser["role"] }>(
      newAccessToken,
    );
    setAuth({
      user: { userId: decoded.sub, role: decoded.role },
      accessToken: newAccessToken,
    });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ user: null, accessToken: null });
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
