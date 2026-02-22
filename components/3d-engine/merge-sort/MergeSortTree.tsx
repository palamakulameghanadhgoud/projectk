"use client";

import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";
import { getTreeLayout, getMergeLayout, TREE_TOP_Y } from "@/lib/algorithms/merge-sort/tree-layout";
import { useVisualizationStore } from "@/lib/store";
import type { BarState } from "@/lib/algorithms/merge-sort";
import type { MergeSortStepPayload, MergeSortTreeNode } from "@/lib/algorithms/merge-sort";

const CELL_WIDTH = 0.2;
const CELL_GAP = 0.04;
const CELL_HEIGHT = 0.35;
const ORIGINAL_STRIP_Y = TREE_TOP_Y + 1.4;

function mid(node: MergeSortTreeNode) {
  return Math.floor((node.left + node.right) / 2);
}

/** Fixed strip showing original input – never changes during the sort */
function OriginalArrayStrip({ values }: { values: BarState[] }) {
  const n = values.length;
  const totalWidth = n * (CELL_WIDTH + CELL_GAP) - CELL_GAP;
  const startX = -totalWidth / 2 + CELL_WIDTH / 2 + CELL_GAP / 2;

  return (
    <group position={[0, ORIGINAL_STRIP_Y, 0]}>
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <boxGeometry args={[totalWidth + 0.12, CELL_HEIGHT + 0.06, 0.02]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} metalness={0} />
      </mesh>
      {values.map((bar, i) => {
        const x = startX + i * (CELL_WIDTH + CELL_GAP);
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH * 0.8]} />
              <meshStandardMaterial color="#57534e" roughness={0.6} metalness={0.1} />
            </mesh>
            <Html position={[0, 0, CELL_WIDTH * 0.45]} center distanceFactor={5} className="pointer-events-none">
              <span className="text-[10px] font-bold text-white drop-shadow-md">{bar.value}</span>
            </Html>
          </group>
        );
      })}
      <Html position={[0, CELL_HEIGHT / 2 + 0.5, 0]} center distanceFactor={4} className="pointer-events-none">
        <span className="text-[9px] font-semibold text-slate-400">Original (unchanged)</span>
      </Html>
      <Html position={[0, CELL_HEIGHT / 2 + 0.15, 0]} center distanceFactor={4} className="pointer-events-none">
        <div className="flex gap-0.5 text-[9px] font-mono text-slate-400">
          {Array.from({ length: n }, (_, i) => (
            <span key={i} className="w-3 text-center">{i}</span>
          ))}
        </div>
      </Html>
    </group>
  );
}

function ArrayStripNode({
  node,
  values,
  isActive,
  position,
  showAsMerged,
}: {
  node: MergeSortTreeNode;
  values: BarState[];
  isActive: boolean;
  position: { x: number; y: number; z: number };
  showAsMerged: boolean;
}) {
  const n = values.length;
  const totalWidth = n * (CELL_WIDTH + CELL_GAP) - CELL_GAP;
  const startX = -totalWidth / 2 + CELL_WIDTH / 2 + CELL_GAP / 2;

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <boxGeometry args={[totalWidth + 0.12, CELL_HEIGHT + 0.06, 0.02]} />
        <meshStandardMaterial color={isActive ? "#fef08a" : "#fde047"} roughness={0.8} metalness={0} />
      </mesh>
      {values.map((bar, i) => {
        const x = startX + i * (CELL_WIDTH + CELL_GAP);
        const isCompare = bar.state === "compare" || bar.state === "merged";
        const color = showAsMerged && (bar.state === "merged" || isCompare)
          ? "#22c55e"
          : isCompare
            ? "#f59e0b"
            : "#e2e8f0";
        return (
          <group key={i} position={[x, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[CELL_WIDTH, CELL_HEIGHT, CELL_WIDTH * 0.8]} />
              <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
            </mesh>
            <Html position={[0, 0, CELL_WIDTH * 0.45]} center distanceFactor={5} className="pointer-events-none">
              <span className="text-[10px] font-bold text-white drop-shadow-md">{bar.value}</span>
            </Html>
          </group>
        );
      })}
      <Html position={[0, CELL_HEIGHT / 2 + 0.15, 0]} center distanceFactor={4} className="pointer-events-none">
        <div className="flex gap-0.5 text-[9px] font-mono text-slate-300" style={{ width: totalWidth * 50 }}>
          {Array.from({ length: n }, (_, i) => node.left + i).map((idx) => (
            <span key={idx} className="w-3 text-center">{idx}</span>
          ))}
        </div>
      </Html>
      <Html position={[0, CELL_HEIGHT / 2 + 0.45, 0]} center distanceFactor={4} className="pointer-events-none">
        <div className="flex justify-between text-[9px] font-semibold text-slate-400" style={{ width: Math.max(60, totalWidth * 55), minWidth: 24 }}>
          <span>p</span>
          {node.left < node.right && <span>q</span>}
          <span>r</span>
        </div>
      </Html>
    </group>
  );
}

export function MergeSortTree({ payload }: { payload: MergeSortStepPayload }) {
  const steps = useVisualizationStore((s) => s.steps);
  const currentStepIndex = useVisualizationStore((s) => s.currentStepIndex);
  const tree = payload?.tree;
  const array = payload?.array ?? [];
  const arrayLength = array.length;
  const currentStep = steps[currentStepIndex];
  const stepKind = (currentStep as { stepKind?: string } | undefined)?.stepKind;
  const originalArray = (steps[0]?.payload as MergeSortStepPayload | undefined)?.array ?? array;

  if (!tree?.nodes?.length || arrayLength === 0) {
    return null;
  }
  const edges = tree.edges ?? [];

  const positions = useMemo(
    () => getTreeLayout(tree.nodes, arrayLength),
    [tree.nodes, arrayLength]
  );
  const nonLeafNodes = useMemo(
    () => tree.nodes.filter((n) => n.left < n.right),
    [tree.nodes]
  );
  const mergePositions = useMemo(
    () => getMergeLayout(nonLeafNodes, arrayLength),
    [nonLeafNodes, arrayLength]
  );

  const activeId = tree.activeNodeId ?? null;
  const isMergePhase = payload.phase === "merge" || payload.phase === "compare" || payload.phase === "copy";
  const rootId = arrayLength > 0 ? `0-${arrayLength - 1}` : null;
  const rootPos = rootId ? positions.get(rootId) : null;
  const rootMergePos = rootId ? mergePositions.get(rootId) : null;
  const isDone = stepKind === "merge-sort:done";

  /** Divide tree: always show original segment. Merge section: show current (sorted) segment. */
  const getDivideValues = (node: MergeSortTreeNode): BarState[] =>
    originalArray.slice(node.left, node.right + 1);
  const getMergeValues = (node: MergeSortTreeNode): BarState[] =>
    array.slice(node.left, node.right + 1);

  /** Child ids for merge node (for drawing arrows from children down to this node) */
  const getChildIds = (node: MergeSortTreeNode): [string, string] | null => {
    if (node.left >= node.right) return null;
    const m = mid(node);
    return [`${node.left}-${m}`, `${m + 1}-${node.right}`];
  };

  /** Child position: merge nodes use mergePositions; leaves use divide positions */
  const getChildPosition = (nodeId: string) =>
    mergePositions.get(nodeId) ?? positions.get(nodeId);

  return (
    <group>
      {/* Top: original array – never changes (like reference diagram) */}
      <OriginalArrayStrip values={originalArray} />
      {/* Connect original (top) → root of divide tree */}
      {rootPos && (
        <Line
          points={[[0, ORIGINAL_STRIP_Y, 0], [rootPos.x, rootPos.y, rootPos.z]]}
          color="#64748b"
          lineWidth={1}
        />
      )}
      {/* Divide edges: parent down to children (gray) */}
      {edges.map((e) => {
        const fromPos = positions.get(e.from);
        const toPos = positions.get(e.to);
        if (!fromPos || !toPos) return null;
        return (
          <Line
            key={`div-${e.from}-${e.to}`}
            points={[[fromPos.x, fromPos.y, fromPos.z], [toPos.x, toPos.y, toPos.z]]}
            color="#94a3b8"
            lineWidth={1.2}
          />
        );
      })}
      {/* Merge section edges: from two children DOWN to merge node (green) */}
      {nonLeafNodes.map((node) => {
        const childIds = getChildIds(node);
        if (!childIds) return null;
        const [leftId, rightId] = childIds;
        const mergePos = mergePositions.get(node.id);
        if (!mergePos) return null;
        const leftPos = getChildPosition(leftId);
        const rightPos = getChildPosition(rightId);
        const showMerge = isMergePhase && (activeId === node.id || isDone);
        if (!leftPos || !rightPos) return null;
        return (
          <group key={`merge-edges-${node.id}`}>
            <Line
              points={[[leftPos.x, leftPos.y, leftPos.z], [mergePos.x, mergePos.y, mergePos.z]]}
              color={showMerge ? "#22c55e" : "#64748b"}
              lineWidth={showMerge ? 2 : 1}
            />
            <Line
              points={[[rightPos.x, rightPos.y, rightPos.z], [mergePos.x, mergePos.y, mergePos.z]]}
              color={showMerge ? "#22c55e" : "#64748b"}
              lineWidth={showMerge ? 2 : 1}
            />
          </group>
        );
      })}
      {/* Divide tree nodes (all nodes) – original segment only */}
      {tree.nodes.map((node) => (
        <ArrayStripNode
          key={`div-${node.id}`}
          node={node}
          values={getDivideValues(node)}
          isActive={payload.phase === "divide" && node.id === activeId}
          position={positions.get(node.id) ?? { x: 0, y: 0, z: 0 }}
          showAsMerged={false}
        />
      ))}
      {/* Merge section nodes (non-leaf only) – current/sorted segment; final at very bottom */}
      {nonLeafNodes.map((node) => {
        const pos = mergePositions.get(node.id);
        if (!pos) return null;
        const isRootMerge = node.id === rootId;
        return (
          <group key={`merge-${node.id}`}>
            <ArrayStripNode
              node={node}
              values={getMergeValues(node)}
              isActive={isMergePhase && node.id === activeId}
              position={pos}
              showAsMerged
            />
            {isRootMerge && (
              <Html position={[pos.x, pos.y + CELL_HEIGHT / 2 + 0.45, pos.z]} center distanceFactor={4} className="pointer-events-none">
                <span className="text-[9px] font-semibold text-slate-400">
                  {isDone ? "Sorted result (final)" : "Merge result"}
                </span>
              </Html>
            )}
          </group>
        );
      })}
      {/* Optional: connect divide root to merge root when done (all connect at end) */}
      {isDone && rootPos && rootMergePos && (
        <Line
          points={[[rootPos.x, rootPos.y, rootPos.z], [rootMergePos.x, rootMergePos.y, rootMergePos.z]]}
          color="#22c55e"
          lineWidth={1.5}
        />
      )}
    </group>
  );
}
