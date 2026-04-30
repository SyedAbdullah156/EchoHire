"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/auth/actions";

interface UserProfile {
  avatarDataUrl?: string;
  skills?: { label: string; value: number; color: string }[];
  linkedinScore?: number;
  resumeScore?: number;
  [key: string]: unknown;
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "admin";
  profile?: UserProfile;
  company_id?: string;
  isApproved?: boolean;
  mfaEnabled?: boolean;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = React.useCallback(async () => {
    try {
      const res = await fetch("/api/me");

      if (res.ok) {
        const result = await res.json();
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchUser());
  }, [fetchUser]);

  const login = React.useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = React.useCallback(async () => {
    await logoutAction();
    setUser(null);
    router.push("/auth");
  }, [router]);

  const refreshUser = React.useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const value = React.useMemo(() => ({
    user,
    loading,
    login,
    logout,
    refreshUser
  }), [user, loading, login, logout, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
