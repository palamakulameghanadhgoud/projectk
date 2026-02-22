/**
 * Global state for visualization playback and mode.
 * Used by AlgorithmVisualization and controls.
 */

import { create } from "zustand";
import type { VisualizationStep } from "@/lib/types";

export type ViewMode = "student" | "teacher";
export type MergeSortViewMode = "bars" | "tree";

export interface VisualizationState {
  /** Current algorithm (e.g. "merge-sort") */
  algorithmId: string | null;
  /** Merge sort only: show bar chart or recursion tree */
  mergeSortViewMode: MergeSortViewMode;
  /** Merge sort tree: camera follows active node (divide/merge), then final result */
  mergeSortAutoCamera: boolean;
  /** Precomputed steps from step generator (payload type varies by algorithm) */
  steps: VisualizationStep<unknown>[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number;
  viewMode: ViewMode;
  /** Teacher: annotation overlay visible */
  showAnnotations: boolean;
  /** Teacher: pause on each step for explanation */
  pauseOnStep: boolean;
}

export interface VisualizationActions {
  setAlgorithm: (id: string | null, steps: VisualizationStep<unknown>[]) => void;
  setCurrentStep: (index: number) => void;
  stepForward: () => void;
  stepBack: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setShowAnnotations: (show: boolean) => void;
  setPauseOnStep: (pause: boolean) => void;
  setMergeSortViewMode: (mode: MergeSortViewMode) => void;
  setMergeSortAutoCamera: (on: boolean) => void;
  reset: () => void;
}

const initialState: VisualizationState = {
  algorithmId: null,
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 1,
  viewMode: "student",
  showAnnotations: true,
  pauseOnStep: true,
  mergeSortViewMode: "bars",
  mergeSortAutoCamera: true,
};

export const useVisualizationStore = create<VisualizationState & VisualizationActions>((set) => ({
  ...initialState,

  setAlgorithm: (algorithmId, steps) =>
    set({ algorithmId, steps, currentStepIndex: 0, isPlaying: false }),

  setCurrentStep: (currentStepIndex) => set({ currentStepIndex }),

  stepForward: () =>
    set((s) => ({
      currentStepIndex: Math.min(s.currentStepIndex + 1, s.steps.length - 1),
    })),

  stepBack: () =>
    set((s) => ({
      currentStepIndex: Math.max(0, s.currentStepIndex - 1),
    })),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setSpeed: (speed) => set({ speed }),

  setViewMode: (viewMode) => set({ viewMode }),

  setShowAnnotations: (showAnnotations) => set({ showAnnotations }),

  setPauseOnStep: (pauseOnStep) => set({ pauseOnStep }),

  setMergeSortViewMode: (mergeSortViewMode) => set({ mergeSortViewMode }),

  setMergeSortAutoCamera: (mergeSortAutoCamera) => set({ mergeSortAutoCamera }),

  reset: () =>
    set({
      currentStepIndex: 0,
      isPlaying: false,
    }),
}));
