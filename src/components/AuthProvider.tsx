"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getProgress, saveProgress } from "@/lib/spaced-repetition";
import {
  getSessionAction,
  logoutAction,
  syncProgressAction,
  loadProgressAction,
} from "@/lib/actions";
import { mergeProgress } from "@/lib/progress-merge";

interface UserInfo {
  userId: string;
  email: string;
}

interface AuthContextType {
  user: UserInfo | null;
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
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const syncWithServer = useCallback(async () => {
    try {
      const local = getProgress();
      const remote = await loadProgressAction();
      const merged = mergeProgress(local, remote);

      // Save merged data locally
      saveProgress(merged);

      // Push merged data to server
      await syncProgressAction(merged);
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }, []);

  useEffect(() => {
    getSessionAction().then((session) => {
      setUser(session);
      setLoading(false);
      if (session) {
        syncWithServer();
      }
    });
  }, [syncWithServer]);

  const signOut = async () => {
    await logoutAction();
    setUser(null);
    window.location.href = "/";
  };

  const syncNow = useCallback(async () => {
    if (user) {
      await syncWithServer();
    }
  }, [user, syncWithServer]);

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
