"use client";

import { useVisualizationStore } from "@/lib/store";
import type { ViewMode } from "@/lib/store";

export function ViewModeToggle() {
  const { viewMode, setViewMode, setShowAnnotations, setPauseOnStep } = useVisualizationStore();

  const setMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "teacher") {
      setShowAnnotations(true);
      setPauseOnStep(true);
    } else {
      setShowAnnotations(true);
      setPauseOnStep(false);
    }
  };

  return (
    <div className="flex gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1">
      <button
        onClick={() => setMode("student")}
        className={`rounded px-3 py-1.5 text-sm ${
          viewMode === "student" ? "bg-slate-600 text-white" : "text-slate-400"
        }`}
      >
        Student
      </button>
      <button
        onClick={() => setMode("teacher")}
        className={`rounded px-3 py-1.5 text-sm ${
          viewMode === "teacher" ? "bg-slate-600 text-white" : "text-slate-400"
        }`}
      >
        Teacher
      </button>
    </div>
  );
}
