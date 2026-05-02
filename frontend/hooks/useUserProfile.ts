"use client";

import { useState, useEffect } from "react";

type UserProfile = {
  name: string;
  avatarDataUrl: string | null;
};

export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>({ name: "", avatarDataUrl: null });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("echohire-token");
      if (!token) return;

      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:5050";
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const body = await res.json();
        setProfile({
          name: body?.data?.name ?? "",
          avatarDataUrl: body?.data?.profile?.avatarDataUrl ?? null,
        });
      } catch {
        // fail silently — avatar will fall back to initials
      }
    };

    fetchProfile();
  }, []);

  return profile;
}
