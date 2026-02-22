/**
 * Preset graphs for Dijkstra and MST visualizations.
 */

import type { DijkstraConfig } from "./dijkstra";
import type { MSTConfig } from "./mst";

export const DIJKSTRA_PRESETS: { name: string; config: DijkstraConfig }[] = [
  {
    name: "Simple 4-node",
    config: {
      nodeIds: ["A", "B", "C", "D"],
      edges: [
        { from: "A", to: "B", weight: 4 },
        { from: "A", to: "C", weight: 2 },
        { from: "B", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 5 },
        { from: "C", to: "D", weight: 8 },
      ],
      sourceId: "A",
    },
  },
  {
    name: "6-node network",
    config: {
      nodeIds: ["0", "1", "2", "3", "4", "5"],
      edges: [
        { from: "0", to: "1", weight: 7 },
        { from: "0", to: "2", weight: 9 },
        { from: "0", to: "5", weight: 14 },
        { from: "1", to: "2", weight: 10 },
        { from: "1", to: "3", weight: 15 },
        { from: "2", to: "3", weight: 11 },
        { from: "2", to: "5", weight: 2 },
        { from: "3", to: "4", weight: 6 },
        { from: "4", to: "5", weight: 9 },
      ],
      sourceId: "0",
    },
  },
];

export const MST_PRESETS: { name: string; config: MSTConfig }[] = [
  {
    name: "Simple 4-node",
    config: {
      nodeIds: ["A", "B", "C", "D"],
      edges: [
        { from: "A", to: "B", weight: 4 },
        { from: "A", to: "C", weight: 2 },
        { from: "B", to: "C", weight: 1 },
        { from: "B", to: "D", weight: 5 },
        { from: "C", to: "D", weight: 8 },
      ],
    },
  },
  {
    name: "6-node network",
    config: {
      nodeIds: ["0", "1", "2", "3", "4", "5"],
      edges: [
        { from: "0", to: "1", weight: 7 },
        { from: "0", to: "2", weight: 9 },
        { from: "0", to: "5", weight: 14 },
        { from: "1", to: "2", weight: 10 },
        { from: "1", to: "3", weight: 15 },
        { from: "2", to: "3", weight: 11 },
        { from: "2", to: "5", weight: 2 },
        { from: "3", to: "4", weight: 6 },
        { from: "4", to: "5", weight: 9 },
      ],
    },
  },
];
