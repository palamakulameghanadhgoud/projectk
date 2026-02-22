"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useVisualizationStore } from "@/lib/store";
import { generateMergeSortSteps } from "@/lib/algorithms";

const MIN_NODES = 2;
const MAX_NODES = 24;
const DEFAULT_INPUT = "5, 2, 8, 1, 9, 3, 7, 4";

function parseInput(input: string): number[] {
  const raw = input
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const numbers: number[] = [];
  for (const s of raw) {
    const n = Number(s);
    if (!Number.isNaN(n) && Number.isFinite(n) && n >= 0 && n <= 999) {
      numbers.push(Math.round(n));
    }
  }
  return numbers;
}

export function InputControls() {
  const [inputText, setInputText] = useState(DEFAULT_INPUT);
  const [error, setError] = useState<string | null>(null);
  const setAlgorithm = useVisualizationStore((s) => s.setAlgorithm);

  const handleVisualize = () => {
    setError(null);
    const values = parseInput(inputText);
    if (values.length < MIN_NODES) {
      setError(`Enter at least ${MIN_NODES} numbers (comma or space separated).`);
      return;
    }
    if (values.length > MAX_NODES) {
      setError(`Maximum ${MAX_NODES} nodes allowed.`);
      return;
    }
    const steps = generateMergeSortSteps({ inputSize: values.length, values });
    setAlgorithm("merge-sort", steps);
  };

  return (
    <div className="space-y-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-1 min-w-[200px] flex-col gap-1">
          <span className="text-sm font-medium text-slate-300">Node values</span>
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 5, 2, 8, 1, 9, 3, 7, 4"
            className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </label>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVisualize}
          className="rounded bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Visualize Sort
        </motion.button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-slate-500">
        Enter numbers separated by commas or spaces ({MIN_NODES}–{MAX_NODES} nodes, 0–999).
      </p>
    </div>
  );
}
