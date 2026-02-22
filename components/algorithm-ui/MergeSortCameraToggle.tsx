"use client";

import { useVisualizationStore } from "@/lib/store";

export function MergeSortCameraToggle() {
  const { mergeSortViewMode, mergeSortAutoCamera, setMergeSortAutoCamera } = useVisualizationStore();

  if (mergeSortViewMode !== "tree") return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-2 py-1">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={mergeSortAutoCamera}
          onChange={(e) => setMergeSortAutoCamera(e.target.checked)}
          className="rounded accent-indigo-500"
        />
        Follow camera
      </label>
    </div>
  );
}
