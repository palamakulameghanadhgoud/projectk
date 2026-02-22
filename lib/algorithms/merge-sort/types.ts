/**
 * Merge Sort visualization payloads and config.
 */

import type { VisualizationStep } from "@/lib/types";

/** Single bar state in the array visualization */
export interface BarState {
  value: number;
  index: number;
  /** Highlight state for current step */
  state: "idle" | "compare" | "selected" | "merged" | "pivot";
}

/** Recursion tree node for tree view (divide/split structure) */
export interface MergeSortTreeNode {
  id: string;
  left: number;
  right: number;
  depth: number;
  parentId?: string;
}

/** Recursion tree edge */
export interface MergeSortTreeEdge {
  from: string;
  to: string;
}

/** Payload for merge-sort steps */
export interface MergeSortStepPayload {
  /** Current array state (indices and values) */
  array: BarState[];
  /** For "merge" steps: left/right bounds */
  left?: number;
  mid?: number;
  right?: number;
  /** Indices being compared or merged */
  highlightIndices?: number[];
  /** Recursion tree node id for tree view */
  nodeId?: string;
  /** "divide" | "merge" | "compare" | "copy" */
  phase?: "divide" | "merge" | "compare" | "copy";
  /** Recursion tree for tree view: nodes + edges + which node is active */
  tree?: {
    nodes: MergeSortTreeNode[];
    edges: MergeSortTreeEdge[];
    activeNodeId: string | null;
  };
}

export type MergeSortStep = VisualizationStep<MergeSortStepPayload>;

export interface MergeSortConfig {
  /** Input array size (will generate random values if values not provided) */
  inputSize: number;
  /** Optional fixed values; if length < inputSize, rest are random */
  values?: number[];
}
