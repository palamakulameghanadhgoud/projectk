/**
 * Prim's Minimum Spanning Tree: step-by-step steps for visualization.
 * Nodes as spheres, edges shown; MST edges highlighted.
 */

import type { VisualizationStep } from "@/lib/types";
import type { GraphEdge, GraphNode } from "../graph-types";
import { layoutNodesOnCircle } from "../graph-layout";
import type { MSTConfig, MSTStepPayload } from "./types";

export function generateMSTSteps(config: MSTConfig): VisualizationStep<MSTStepPayload>[] {
  const { nodeIds, edges } = config;
  const positions = layoutNodesOnCircle(nodeIds);
  const steps: VisualizationStep<MSTStepPayload>[] = [];
  let stepIndex = 0;

  const inTree = new Set<string>();
  const mstEdges: { from: string; to: string; weight: number }[] = [];
  const start = nodeIds[0];
  inTree.add(start);

  const makeNodes = (): GraphNode[] => {
    return nodeIds.map((id) => {
      const pos = positions.get(id)!;
      return {
        id,
        label: id,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        state: inTree.has(id) ? "inTree" : "idle",
      };
    });
  };

  const makeEdges = (activeEdge?: { from: string; to: string }): GraphEdge[] => {
    return edges.map((e) => {
      let state: GraphEdge["state"] = "idle";
      const inMst = mstEdges.some(
        (t) => (t.from === e.from && t.to === e.to) || (t.from === e.to && t.to === e.from)
      );
      if (inMst) state = "inTree";
      if (
        activeEdge &&
        ((e.from === activeEdge.from && e.to === activeEdge.to) ||
          (e.from === activeEdge.to && e.to === activeEdge.from))
      )
        state = "active";
      return { from: e.from, to: e.to, weight: e.weight, state };
    });
  };

  steps.push({
    id: `mst-${stepIndex}`,
    index: stepIndex++,
    stepKind: "mst:init",
    description: `Start with node ${start}. Add minimum-weight edges to grow the spanning tree.`,
    subLabel: "Initialize",
    payload: { nodes: makeNodes(), edges: makeEdges() },
  });

  while (inTree.size < nodeIds.length) {
    let best: { from: string; to: string; weight: number } | null = null;
    let bestWeight = Number.MAX_SAFE_INTEGER;
    for (const e of edges) {
      const fromIn = inTree.has(e.from);
      const toIn = inTree.has(e.to);
      if (fromIn === toIn) continue;
      if (e.weight < bestWeight) {
        bestWeight = e.weight;
        best = e;
      }
    }
    if (!best) break;

    const nodesBefore = makeNodes();
    steps.push({
      id: `mst-${stepIndex}`,
      index: stepIndex++,
      stepKind: "mst:choose",
      description: `Add edge ${best.from} — ${best.to} (weight ${best.weight}), minimum crossing the cut.`,
      subLabel: "Add edge",
      payload: { nodes: nodesBefore, edges: makeEdges(best) },
    });

    mstEdges.push(best);
    inTree.add(best.from);
    inTree.add(best.to);
  }

  steps.push({
    id: `mst-${stepIndex}`,
    index: stepIndex++,
    stepKind: "mst:done",
    description: `Minimum spanning tree complete. Total weight: ${mstEdges.reduce((s, e) => s + e.weight, 0)}.`,
    subLabel: "Done",
    payload: { nodes: makeNodes(), edges: makeEdges() },
  });

  return steps;
}
