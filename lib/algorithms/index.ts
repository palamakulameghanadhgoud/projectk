/**
 * Algorithm registry for the DAA platform.
 * Add new algorithms here; each exports generateSteps(config) and config types.
 */

export type { GraphEdge, GraphNode, GraphStepPayload } from "./graph-types";
export { generateDijkstraSteps } from "./dijkstra";
export type { DijkstraConfig } from "./dijkstra";
export { generateMSTSteps } from "./mst";
export type { MSTConfig } from "./mst";
export { generateMergeSortSteps } from "./merge-sort";
export type { MergeSortConfig } from "./merge-sort";
