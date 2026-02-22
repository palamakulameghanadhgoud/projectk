/**
 * Dijkstra shortest path: step-by-step steps for visualization.
 * Produces steps with graph payload (nodes as spheres, edges).
 */

import type { VisualizationStep } from "@/lib/types";
import type { GraphEdge, GraphNode } from "../graph-types";
import { buildGraphNodes, layoutNodesOnCircle } from "../graph-layout";
import type { DijkstraConfig, DijkstraStepPayload } from "./types";

export function generateDijkstraSteps(config: DijkstraConfig): VisualizationStep<DijkstraStepPayload>[] {
  const { nodeIds, edges, sourceId } = config;
  const positions = layoutNodesOnCircle(nodeIds);
  const steps: VisualizationStep<DijkstraStepPayload>[] = [];
  let stepIndex = 0;

  const INF = Number.MAX_SAFE_INTEGER;
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  nodeIds.forEach((id) => {
    dist[id] = id === sourceId ? 0 : INF;
    prev[id] = null;
  });

  const visited = new Set<string>();
  const treeEdges: { from: string; to: string; weight: number }[] = [];

  const makeNodes = (): GraphNode[] => {
    return nodeIds.map((id) => {
      const pos = positions.get(id)!;
      let state: GraphNode["state"] = "idle";
      if (visited.has(id)) state = "inPath";
      return {
        id,
        label: id,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        state,
        distance: dist[id] === INF ? undefined : dist[id],
      };
    });
  };

  const makeEdges = (currentId?: string, relaxed?: { from: string; to: string }): GraphEdge[] => {
    return edges.map((e) => {
      let state: GraphEdge["state"] = "idle";
      if (treeEdges.some((t) => (t.from === e.from && t.to === e.to) || (t.from === e.to && t.to === e.from)))
        state = "inPath";
      if (relaxed && ((e.from === relaxed.from && e.to === relaxed.to) || (e.from === relaxed.to && e.to === relaxed.from)))
        state = "active";
      return { from: e.from, to: e.to, weight: e.weight, state };
    });
  };

  steps.push({
    id: `dij-${stepIndex}`,
    index: stepIndex++,
    stepKind: "dijkstra:init",
    description: `Start from node ${sourceId}. Distance 0 at source; others infinite.`,
    subLabel: "Initialize",
    payload: {
      nodes: makeNodes(),
      edges: makeEdges(),
    },
  });

  while (visited.size < nodeIds.length) {
    let u: string | null = null;
    let minD = INF;
    for (const id of nodeIds) {
      if (!visited.has(id) && dist[id] < minD) {
        minD = dist[id];
        u = id;
      }
    }
    if (u === null || minD === INF) break;

    const nodesBefore = makeNodes();
    nodesBefore.forEach((n) => {
      if (n.id === u) n.state = "current";
    });
    steps.push({
      id: `dij-${stepIndex}`,
      index: stepIndex++,
      stepKind: "dijkstra:select",
      description: `Select node ${u} (minimum distance ${dist[u]}).`,
      subLabel: "Select min",
      payload: { nodes: nodesBefore, edges: makeEdges(u) },
    });

    visited.add(u);

    for (const e of edges) {
      if (e.from !== u && e.to !== u) continue;
      const v = e.from === u ? e.to : e.from;
      if (visited.has(v)) continue;
      const alt = dist[u] + e.weight;
      if (alt < dist[v]) {
        const oldDist = dist[v];
        dist[v] = alt;
        prev[v] = u;
        treeEdges.push({ from: u, to: v, weight: e.weight });
        const nodesRelax = makeNodes();
        nodesRelax.forEach((n) => {
          if (n.id === u) n.state = "current";
        });
        steps.push({
          id: `dij-${stepIndex}`,
          index: stepIndex++,
          stepKind: "dijkstra:relax",
          description: `Relax ${u} → ${v}: distance ${v} = ${alt} (was ${oldDist === INF ? "∞" : oldDist}).`,
          subLabel: "Relax edge",
          payload: {
            nodes: nodesRelax,
            edges: makeEdges(u, { from: u, to: v }),
          },
        });
      }
    }
  }

  const finalNodes = makeNodes();
  steps.push({
    id: `dij-${stepIndex}`,
    index: stepIndex++,
    stepKind: "dijkstra:done",
    description: "Shortest path tree complete. All reachable nodes have final distances.",
    subLabel: "Done",
    payload: { nodes: finalNodes, edges: makeEdges() },
  });

  return steps;
}
