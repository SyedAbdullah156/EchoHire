"use client";

import { useAuth } from "@/context/AuthContext";

export function useUserRole() {
  const { user, loading } = useAuth();
  return { role: user?.role ?? null, loading };
}
