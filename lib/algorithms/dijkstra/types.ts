import type { VisualizationStep } from "@/lib/types";
import type { GraphStepPayload } from "../graph-types";

export interface DijkstraConfig {
  nodeIds: string[];
  edges: { from: string; to: string; weight: number }[];
  sourceId: string;
}

export type DijkstraStepPayload = GraphStepPayload;
export type DijkstraStep = VisualizationStep<DijkstraStepPayload>;
