"use client";

import { useAuth, User } from "@/context/AuthContext";

export function useUserProfile() {
  const { user, loading } = useAuth();
  
  return {
    name: user?.name ?? "",
    avatarDataUrl: user?.profile?.avatarDataUrl ?? null,
    isApproved: user?.isApproved ?? true,
    createdAt: user?.createdAt ?? null,
    user: user as User | null,
    loading
  };
}
