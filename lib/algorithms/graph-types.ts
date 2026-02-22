/**
 * Shared graph types for Dijkstra, MST, and other graph algorithm visualizations.
 * Used by step generators and the 3D graph component (spheres + edges).
 */

export interface GraphNode {
  id: string;
  label?: string;
  x: number;
  y: number;
  z: number;
  /** For rendering: idle | visited | current | inPath | inTree */
  state?: "idle" | "visited" | "current" | "inPath" | "inTree";
  /** Optional distance label (Dijkstra) */
  distance?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  /** idle | active | inPath | inTree */
  state?: "idle" | "active" | "inPath" | "inTree";
}

export interface GraphStepPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** Input: adjacency list or edge list for step generators */
export interface GraphConfig {
  nodeIds: string[];
  edges: { from: string; to: string; weight: number }[];
}
