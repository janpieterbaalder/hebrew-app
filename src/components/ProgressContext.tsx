"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useTransition,
  type ReactNode,
} from "react";
import { getProgress, type ProgressData } from "@/lib/spaced-repetition";
import { syncProgressAction, loadProgressAction } from "@/lib/actions";
import { mergeProgress } from "@/lib/progress-merge";

const STORAGE_KEY = "hebrew-app-progress";

const defaultProgress: ProgressData = {
  cards: {},
  stats: {
    totalReviewed: 0,
    streak: 0,
    lastStudyDate: "",
    wordsLearned: 0,
    lettersLearned: 0,
    grammarCompleted: [],
  },
};

interface ProgressContextType {
  progress: ProgressData;
  ready: boolean;
  updateProgress: (updater: (prev: ProgressData) => ProgressData) => void;
}

const ProgressContext = createContext<ProgressContextType>({
  progress: defaultProgress,
  ready: false,
  updateProgress: () => {},
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(defaultProgress);
  const [ready, setReady] = useState(false);
  // startTransition marks server-action calls as non-urgent transitions,
  // preventing the "Cannot update Router while rendering" warning that occurs
  // because Next.js server actions internally trigger router state updates.
  const [, startTransition] = useTransition();

  // On mount: load from server, merge with localStorage, mark ready.
  useEffect(() => {
    startTransition(async () => {
      const local = getProgress();
      const remote = await loadProgressAction();
      const merged = mergeProgress(local, remote);

      // Write merged result to localStorage as the new local baseline
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

      setProgress(merged);
      setReady(true);

      // Push merged data to server in the background.
      // Handles the case where localStorage had newer data than the server
      // (e.g. user studied while offline or before logging in).
      await syncProgressAction(merged).catch((err) =>
        console.error("Initial sync to server failed:", err)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After every progress update (once ready), persist to localStorage and Neon.
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    startTransition(async () => {
      await syncProgressAction(progress).catch((err) =>
        console.error("Sync failed:", err)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, ready]);

  // Pure setState updater — no side effects inside.
  const updateProgress = useCallback(
    (updater: (prev: ProgressData) => ProgressData) => {
      setProgress((prev) => updater(prev));
    },
    []
  );

  return (
    <ProgressContext.Provider value={{ progress, ready, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
