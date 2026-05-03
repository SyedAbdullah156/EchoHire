"use client";

import { useAuth } from "@/context/AuthContext";

export function useUserProfile() {
  const { user, loading } = useAuth();
  
  return {
    name: user?.name ?? "",
    avatarDataUrl: user?.profile?.avatarDataUrl ?? null,
    isApproved: user?.isApproved ?? true,
    createdAt: (user as any)?.createdAt ?? null,
    loading
  };
}
