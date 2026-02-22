/**
 * Shared tree layout for merge sort (reference diagram: divide top-down, merge below).
 */

import type { MergeSortTreeNode } from "./types";

/** Keep all content above the platform (floor at y = -2.5). */
const PLATFORM_Y = -2.5;
const CLEARANCE = 0.15;

export const TREE_TOP_Y = 1.8;
/** Merge section: 3 rows; bottom row just above platform. */
export const MERGE_ROW_3_Y = PLATFORM_Y + CLEARANCE;
export const MERGE_ROW_2_Y = MERGE_ROW_3_Y + 0.8;
export const MERGE_ROW_1_Y = MERGE_ROW_2_Y + 0.8;
/** Divide tree leaves sit above the first merge row. */
export const TREE_BOTTOM_Y = MERGE_ROW_1_Y + 0.5;
const SPAN = 5;

export function getTreeLayout(
  nodes: MergeSortTreeNode[],
  arrayLength: number
): Map<string, { x: number; y: number; z: number }> {
  const pos = new Map<string, { x: number; y: number; z: number }>();
  if (arrayLength <= 0) return pos;
  const maxDepth = Math.max(0, ...nodes.map((n) => n.depth));
  const levelGap = maxDepth > 0 ? (TREE_TOP_Y - TREE_BOTTOM_Y) / maxDepth : 0;
  const maxIdx = arrayLength - 1;
  nodes.forEach((node) => {
    const center = (node.left + node.right) / 2;
    const x = (center / Math.max(1, maxIdx) - 0.5) * SPAN * 2;
    const y = TREE_TOP_Y - node.depth * levelGap;
    pos.set(node.id, { x, y, z: 0 });
  });
  return pos;
}

/** Positions for merge-result nodes only (non-leaf). Row by depth: depth 2 → row 1, depth 1 → row 2, depth 0 → row 3 (bottom). */
export function getMergeLayout(
  nodes: MergeSortTreeNode[],
  arrayLength: number
): Map<string, { x: number; y: number; z: number }> {
  const pos = new Map<string, { x: number; y: number; z: number }>();
  if (arrayLength <= 0) return pos;
  const maxIdx = arrayLength - 1;
  const nonLeaf = nodes.filter((n) => n.left < n.right);
  nonLeaf.forEach((node) => {
    const center = (node.left + node.right) / 2;
    const x = (center / Math.max(1, maxIdx) - 0.5) * SPAN * 2;
    const y =
      node.depth === 0
        ? MERGE_ROW_3_Y
        : node.depth === 1
          ? MERGE_ROW_2_Y
          : MERGE_ROW_1_Y;
    pos.set(node.id, { x, y, z: 0 });
  });
  return pos;
}
