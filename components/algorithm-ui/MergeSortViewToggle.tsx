"use client";

import { useVisualizationStore } from "@/lib/store";
import type { MergeSortViewMode } from "@/lib/store";

export function MergeSortViewToggle() {
  const { mergeSortViewMode, setMergeSortViewMode } = useVisualizationStore();

  return (
    <div className="flex gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1">
      <button
        onClick={() => setMergeSortViewMode("bars")}
        className={`rounded px-3 py-1.5 text-sm ${
          mergeSortViewMode === "bars" ? "bg-slate-600 text-white" : "text-slate-400"
        }`}
      >
        Bar chart
      </button>
      <button
        onClick={() => setMergeSortViewMode("tree")}
        className={`rounded px-3 py-1.5 text-sm ${
          mergeSortViewMode === "tree" ? "bg-slate-600 text-white" : "text-slate-400"
        }`}
      >
        Recursion tree
      </button>
    </div>
  );
}
