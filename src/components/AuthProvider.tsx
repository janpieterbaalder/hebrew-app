"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getProgress, saveProgress } from "@/lib/spaced-repetition";
import {
  syncProgressToSupabase,
  loadProgressFromSupabase,
  mergeProgress,
} from "@/lib/supabase-sync";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  syncNow: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncWithSupabase = useCallback(async (userId: string) => {
    try {
      const local = getProgress();
      const remote = await loadProgressFromSupabase(userId);
      const merged = mergeProgress(local, remote);

      // Save merged data locally
      saveProgress(merged);

      // Push merged data to Supabase
      await syncProgressToSupabase(userId, merged);
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
      if (user) {
        syncWithSupabase(user.id);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      setLoading(false);
      if (newUser) {
        syncWithSupabase(newUser.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncWithSupabase]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  const syncNow = useCallback(async () => {
    if (user) {
      await syncWithSupabase(user.id);
    }
  }, [user, syncWithSupabase]);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, syncNow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
