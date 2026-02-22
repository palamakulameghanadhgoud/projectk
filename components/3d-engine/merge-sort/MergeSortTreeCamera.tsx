"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { useVisualizationStore } from "@/lib/store";
import { getTreeLayout, getMergeLayout } from "@/lib/algorithms/merge-sort/tree-layout";
import type { MergeSortStepPayload } from "@/lib/algorithms/merge-sort";

const LERP = 0.08;
const LERP_DONE = 0.12; // faster so camera reaches bottom on final step
const CAMERA_OFFSET: [number, number, number] = [0, 0, 7];
const FINAL_OFFSET: [number, number, number] = [0, 0, 10];

export function MergeSortTreeCamera() {
  const { camera } = useThree();
  const steps = useVisualizationStore((s) => s.steps);
  const currentStepIndex = useVisualizationStore((s) => s.currentStepIndex);
  const targetPosRef = useRef(new Vector3(6, 4, 10));
  const targetLookRef = useRef(new Vector3(0, 0, 0));

  useFrame(() => {
    if (!steps.length || currentStepIndex >= steps.length) return;
    const step = steps[currentStepIndex];
    const payload = step?.payload as MergeSortStepPayload | undefined;
    const tree = payload?.tree;
    const arrayLength = payload?.array?.length ?? 0;
    if (!tree?.nodes.length) return;

    const positions = getTreeLayout(tree.nodes, arrayLength);
    const nonLeaf = tree.nodes.filter((n: { left: number; right: number }) => n.left < n.right);
    const mergePositions = getMergeLayout(nonLeaf, arrayLength);
    const activeId = tree.activeNodeId ?? null;
    const rootId = arrayLength > 0 ? `0-${arrayLength - 1}` : null;
    const isDone = step?.stepKind === "merge-sort:done";
    const isMergePhase = payload?.phase === "merge" || payload?.phase === "compare" || payload?.phase === "copy";
    const focusId = activeId ?? rootId;

    // Done: frame the final sorted array at the very bottom (merge root). Otherwise follow active node:
    // during merge phase use merge-section position so camera moves down to the bottom; during divide use divide-tree position.
    let pos: { x: number; y: number; z: number } | null = null;
    if (isDone && rootId) {
      pos = mergePositions.get(rootId) ?? positions.get(rootId) ?? null;
    } else if (focusId) {
      pos = (isMergePhase && mergePositions.has(focusId))
        ? mergePositions.get(focusId) ?? null
        : positions.get(focusId) ?? null;
    }

    if (pos) {
      const offset = isDone ? FINAL_OFFSET : CAMERA_OFFSET;
      targetLookRef.current.set(pos.x, pos.y, pos.z);
      targetPosRef.current.set(pos.x + offset[0], pos.y + offset[1], pos.z + offset[2]);
    }

    camera.position.lerp(targetPosRef.current, isDone ? LERP_DONE : LERP);
    camera.lookAt(targetLookRef.current);
  });

  return null;
}
