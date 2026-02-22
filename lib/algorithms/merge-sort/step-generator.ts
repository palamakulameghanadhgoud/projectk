/**
 * Merge Sort step generator.
 * Produces VisualizationStep[] from config; no 3D/React dependency.
 */

import type { VisualizationStep } from "@/lib/types";
import type { BarState, MergeSortConfig, MergeSortStepPayload, MergeSortTreeEdge, MergeSortTreeNode } from "./types";

function buildRecursionTree(
  left: number,
  right: number,
  depth: number,
  parentId: string | null
): { nodes: MergeSortTreeNode[]; edges: MergeSortTreeEdge[] } {
  const id = `${left}-${right}`;
  const nodes: MergeSortTreeNode[] = [{ id, left, right, depth, parentId: parentId ?? undefined }];
  const edges: MergeSortTreeEdge[] = [];
  if (parentId) edges.push({ from: parentId, to: id });
  if (left >= right) return { nodes, edges };
  const mid = Math.floor((left + right) / 2);
  const leftResult = buildRecursionTree(left, mid, depth + 1, id);
  const rightResult = buildRecursionTree(mid + 1, right, depth + 1, id);
  return {
    nodes: [...nodes, ...leftResult.nodes, ...rightResult.nodes],
    edges: [...edges, ...leftResult.edges, ...rightResult.edges],
  };
}

function toBarState(arr: number[]): BarState[] {
  return arr.map((value, index) => ({ value, index, state: "idle" }));
}

function setBarStates(
  bars: BarState[],
  indices: number[],
  state: BarState["state"]
): BarState[] {
  const next: BarState[] = bars.map((b) => ({ ...b, state: "idle" }));
  indices.forEach((i) => {
    if (next[i]) next[i] = { ...next[i], state };
  });
  return next;
}

/**
 * Generates all steps for merge sort visualization (divide + merge phases).
 */
export function generateMergeSortSteps(config: MergeSortConfig): VisualizationStep<MergeSortStepPayload>[] {
  const maxSize = 32;
  const arr =
    config.values && config.values.length >= 2
      ? config.values.slice(0, maxSize)
      : Array.from(
          { length: Math.min(Math.max(2, config.inputSize), maxSize) },
          () => Math.floor(Math.random() * 20) + 1
        );
  const size = arr.length;

  const steps: VisualizationStep<MergeSortStepPayload>[] = [];
  let stepIndex = 0;
  const n = size;
  const { nodes: treeNodes, edges: treeEdges } = buildRecursionTree(0, n - 1, 0, null);
  const tree = { nodes: treeNodes, edges: treeEdges };
  const withTree = (p: Omit<MergeSortStepPayload, "tree">): MergeSortStepPayload =>
    "left" in p && "right" in p
      ? { ...p, tree: { ...tree, activeNodeId: `${p.left}-${p.right}` } }
      : { ...p, tree: { ...tree, activeNodeId: null } };

  const merge = (values: number[], left: number, mid: number, right: number) => {
    const leftArr = values.slice(left, mid + 1);
    const rightArr = values.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      const barState = toBarState(values);
      const highlight = [left + i, mid + 1 + j];
      steps.push({
        id: `ms-${stepIndex}`,
        index: stepIndex++,
        stepKind: "merge-sort:compare",
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        subLabel: "Compare",
        payload: withTree({
          array: setBarStates(barState, highlight, "compare"),
          left,
          mid,
          right,
          highlightIndices: highlight,
          phase: "compare",
        }),
        recursionDepth: 0,
      });

      if (leftArr[i] <= rightArr[j]) {
        values[k++] = leftArr[i++];
      } else {
        values[k++] = rightArr[j++];
      }

      steps.push({
        id: `ms-${stepIndex}`,
        index: stepIndex++,
        stepKind: "merge-sort:copy",
        description: `Writing to position ${k - 1}`,
        subLabel: "Copy",
        payload: withTree({
          array: setBarStates(toBarState(values), [k - 1], "merged"),
          left,
          mid,
          right,
          highlightIndices: [k - 1],
          phase: "copy",
        }),
        recursionDepth: 0,
      });
    }

    while (i < leftArr.length) {
      values[k++] = leftArr[i++];
      steps.push({
        id: `ms-${stepIndex}`,
        index: stepIndex++,
        stepKind: "merge-sort:copy",
        description: `Copy remaining from left: position ${k - 1}`,
        payload: withTree({
          array: setBarStates(toBarState(values), [k - 1], "merged"),
          left,
          mid,
          right,
          phase: "copy",
        }),
        recursionDepth: 0,
      });
    }
    while (j < rightArr.length) {
      values[k++] = rightArr[j++];
      steps.push({
        id: `ms-${stepIndex}`,
        index: stepIndex++,
        stepKind: "merge-sort:copy",
        description: `Copy remaining from right: position ${k - 1}`,
        payload: withTree({
          array: setBarStates(toBarState(values), [k - 1], "merged"),
          left,
          mid,
          right,
          phase: "copy",
        }),
        recursionDepth: 0,
      });
    }
  };

  const mergeSort = (values: number[], left: number, right: number, depth: number) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      id: `ms-${stepIndex}`,
      index: stepIndex++,
      stepKind: "merge-sort:divide",
      description: `Divide [${left}..${right}] at mid=${mid}`,
      subLabel: "Divide",
      payload: withTree({
        array: toBarState(values),
        left,
        mid,
        right,
        phase: "divide",
      }),
      recursionDepth: depth,
    });

    mergeSort(values, left, mid, depth + 1);
    mergeSort(values, mid + 1, right, depth + 1);

    steps.push({
      id: `ms-${stepIndex}`,
      index: stepIndex++,
      stepKind: "merge-sort:merge",
      description: `Merge [${left}..${mid}] and [${mid + 1}..${right}]`,
      subLabel: "Merge",
      payload: withTree({
        array: toBarState(values),
        left,
        mid,
        right,
        phase: "merge",
      }),
      recursionDepth: depth,
    });

    merge(values, left, mid, right);
  };

  const values = arr.slice();

  steps.push({
    id: `ms-${stepIndex}`,
    index: stepIndex++,
    stepKind: "merge-sort:init",
    description: "Initial array",
    payload: { array: toBarState(values), tree: { ...tree, activeNodeId: null } },
    recursionDepth: 0,
  });

  mergeSort(values, 0, n - 1, 0);

  const rootId = `0-${n - 1}`;
  steps.push({
    id: `ms-${stepIndex}`,
    index: stepIndex++,
    stepKind: "merge-sort:done",
    description: "Sort complete — final join of both halves into the sorted array",
    payload: {
      array: toBarState(values).map((b) => ({ ...b, state: "merged" as const })),
      tree: { nodes: treeNodes, edges: treeEdges, activeNodeId: rootId },
      phase: "merge",
    },
    recursionDepth: 0,
  });

  return steps;
}
