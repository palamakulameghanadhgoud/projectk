"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useVisualizationStore } from "@/lib/store";
import { generateMSTSteps } from "@/lib/algorithms";
import { MST_PRESETS } from "@/lib/algorithms/preset-graphs";

export function MSTInputControls() {
  const [presetIndex, setPresetIndex] = useState(0);
  const setAlgorithm = useVisualizationStore((s) => s.setAlgorithm);

  const handleVisualize = () => {
    const preset = MST_PRESETS[presetIndex];
    if (!preset) return;
    const steps = generateMSTSteps(preset.config);
    setAlgorithm("mst", steps);
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-300">Graph</span>
          <select
            value={presetIndex}
            onChange={(e) => setPresetIndex(Number(e.target.value))}
            className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
          >
            {MST_PRESETS.map((p, i) => (
              <option key={i} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVisualize}
          className="rounded bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Visualize MST (Prim)
        </motion.button>
      </div>
      <p className="text-xs text-slate-500">
        Prim&apos;s algorithm. Nodes = spheres; green edges = in minimum spanning tree.
      </p>
    </div>
  );
}
