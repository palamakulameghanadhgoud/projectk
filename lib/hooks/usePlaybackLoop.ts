"use client";

import { useEffect, useRef } from "react";
import { useVisualizationStore } from "@/lib/store";

const BASE_INTERVAL_MS = 1200;

/**
 * Advances current step when isPlaying is true, respecting speed.
 */
export function usePlaybackLoop() {
  const { isPlaying, speed, steps } = useVisualizationStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const delay = BASE_INTERVAL_MS / speed;
    intervalRef.current = setInterval(() => {
      const state = useVisualizationStore.getState();
      if (state.currentStepIndex >= state.steps.length - 1) {
        state.pause();
        return;
      }
      state.stepForward();
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

}
