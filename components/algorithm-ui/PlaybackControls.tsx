"use client";

import { motion } from "framer-motion";
import { useVisualizationStore } from "@/lib/store";

const SPEEDS = [0.25, 0.5, 1, 2];

export function PlaybackControls() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    stepForward,
    stepBack,
    togglePlay,
    setSpeed,
    reset,
  } = useVisualizationStore();

  const canStepBack = currentStepIndex > 0;
  const canStepForward = currentStepIndex < steps.length - 1;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={stepBack}
          disabled={!canStepBack}
          className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white disabled:opacity-40"
          aria-label="Step back"
        >
          ← Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={togglePlay}
          className="rounded bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={stepForward}
          disabled={!canStepForward}
          className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white disabled:opacity-40"
          aria-label="Step forward"
        >
          Forward →
        </motion.button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`rounded px-2 py-1 text-xs ${
              speed === s ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            {s}×
          </button>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={reset}
        className="rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-300"
      >
        Reset
      </motion.button>
      <span className="text-xs text-slate-500">
        Step {currentStepIndex + 1} / {steps.length}
      </span>
    </div>
  );
}
