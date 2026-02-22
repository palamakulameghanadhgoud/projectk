/**
 * Core types for the Algorithm Visualization Engine.
 * Decouples algorithm step generation from 3D rendering.
 */

/** Unique identifier for a single step in a visualization */
export type StepId = string;

/**
 * Generic step payload for any algorithm.
 * The engine renders based on stepKind and payload; algorithm logic stays in lib/algorithms.
 */
export interface VisualizationStep<T = Record<string, unknown>> {
  id: StepId;
  index: number;
  /** e.g. "merge-sort:divide" | "tree:visit" */
  stepKind: string;
  /** Human-readable description for explanation panel */
  description: string;
  /** Optional sub-step label (e.g. "Compare", "Swap") */
  subLabel?: string;
  payload: T;
  /** Optional recursion depth for tree visualization */
  recursionDepth?: number;
  /** Timestamp for animation ordering */
  timestamp?: number;
}

/**
 * Playback state for the visualization engine.
 */
export interface PlaybackState {
  isPlaying: boolean;
  currentStepIndex: number;
  speed: number; // 0.25 | 0.5 | 1 | 2
  totalSteps: number;
}

/**
 * Engine config: animation speed, theme hints, etc.
 */
export interface VisualizationEngineConfig {
  animationSpeed: number;
  showLabels: boolean;
  theme: "light" | "dark";
}

/**
 * Algorithm-agnostic step generator contract.
 * Each algorithm implements this to produce steps from its config.
 */
export interface StepGenerator<C = unknown> {
  algorithmId: string;
  generateSteps(config: C): VisualizationStep[];
}
