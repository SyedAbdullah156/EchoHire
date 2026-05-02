"use client";

import { useState, useEffect } from "react";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a production app, you might want to fetch this from an API 
    // or decode a non-sensitive part of the cookie.
    // For this implementation, we can check a 'role' item in localStorage 
    // or hit a lightweight /api/me endpoint.
    
    const fetchRole = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading };
}
