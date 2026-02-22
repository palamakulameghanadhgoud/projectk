import type { VisualizationStep } from "@/lib/types";
import type { GraphStepPayload } from "../graph-types";

export interface MSTConfig {
  nodeIds: string[];
  edges: { from: string; to: string; weight: number }[];
}

export type MSTStepPayload = GraphStepPayload;
export type MSTStep = VisualizationStep<MSTStepPayload>;
