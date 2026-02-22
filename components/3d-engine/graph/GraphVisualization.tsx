"use client";

import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";
import type { GraphEdge, GraphNode, GraphStepPayload } from "@/lib/algorithms/graph-types";

const NODE_RADIUS = 0.35;
const LINE_WIDTH = 2.5;

function nodeColor(state: GraphNode["state"]): string {
  switch (state) {
    case "current":
      return "#f59e0b";
    case "visited":
    case "inPath":
    case "inTree":
      return "#22c55e";
    default:
      return "#64748b";
  }
}

function edgeColor(state: GraphEdge["state"]): string {
  switch (state) {
    case "active":
      return "#f59e0b";
    case "inPath":
    case "inTree":
      return "#22c55e";
    default:
      return "#475569";
  }
}

function NodeSphere({ node }: { node: GraphNode }) {
  const color = nodeColor(node.state ?? "idle");
  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[NODE_RADIUS, 24, 24]} />
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>
      <Html position={[0, NODE_RADIUS + 0.25, 0]} center distanceFactor={6}>
        <span className="text-xs font-semibold text-white drop-shadow-md">
          {node.label ?? node.id}
          {node.distance !== undefined && (
            <span className="ml-0.5 text-slate-300">({node.distance})</span>
          )}
        </span>
      </Html>
    </group>
  );
}

function EdgeLine({
  from,
  to,
  weight,
  state,
  nodeMap,
}: {
  from: string;
  to: string;
  weight: number;
  state: GraphEdge["state"];
  nodeMap: Map<string, GraphNode>;
}) {
  const a = nodeMap.get(from);
  const b = nodeMap.get(to);
  if (!a || !b) return null;

  const color = edgeColor(state ?? "idle");
  const mid: [number, number, number] = [(a.x + b.x) / 2, (a.y + b.y) / 2 + 0.2, (a.z + b.z) / 2];
  const points: [number, number, number][] = [[a.x, a.y, a.z], [b.x, b.y, b.z]];

  return (
    <group>
      <Line points={points} color={color} lineWidth={LINE_WIDTH} />
      <Html position={mid} center distanceFactor={8}>
        <span className="text-[10px] font-medium text-slate-300">{weight}</span>
      </Html>
    </group>
  );
}

export function GraphVisualization({ payload }: { payload: GraphStepPayload }) {
  const { nodes, edges } = payload;
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <group>
      {edges.map((e, i) => (
        <EdgeLine
          key={`${e.from}-${e.to}-${i}`}
          from={e.from}
          to={e.to}
          weight={e.weight}
          state={e.state}
          nodeMap={nodeMap}
        />
      ))}
      {nodes.map((node) => (
        <NodeSphere key={node.id} node={node} />
      ))}
    </group>
  );
}
