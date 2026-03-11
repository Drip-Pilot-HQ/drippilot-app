"use client";

import React, { useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import { useAuthStore } from "../../store/client/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      setInitialized(true);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setInitialized]);

  return <>{children}</>;
}
