/**
 * Compute 3D positions for graph nodes (spheres).
 * Layout: nodes on a circle in the XZ plane, y = 0.
 */

import type { GraphNode } from "./graph-types";

const RADIUS = 4;

export function layoutNodesOnCircle(nodeIds: string[]): Map<string, { x: number; y: number; z: number }> {
  const map = new Map<string, { x: number; y: number; z: number }>();
  const n = nodeIds.length;
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    map.set(nodeIds[i], {
      x: RADIUS * Math.cos(angle),
      y: 0,
      z: RADIUS * Math.sin(angle),
    });
  }
  return map;
}

export function buildGraphNodes(
  nodeIds: string[],
  positions: Map<string, { x: number; y: number; z: number }>,
  state?: GraphNode["state"],
  distance?: number
): GraphNode[] {
  return nodeIds.map((id) => {
    const pos = positions.get(id) ?? { x: 0, y: 0, z: 0 };
    const node: GraphNode = {
      id,
      label: id,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      state: state ?? "idle",
    };
    if (distance !== undefined) node.distance = distance;
    return node;
  });
}
