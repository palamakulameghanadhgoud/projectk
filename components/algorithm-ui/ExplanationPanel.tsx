"use client";

import { useVisualizationStore } from "@/lib/store";

export function ExplanationPanel() {
  const { steps, currentStepIndex, showAnnotations } = useVisualizationStore();
  const step = steps[currentStepIndex];

  if (!showAnnotations || !step) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
      <h3 className="mb-2 text-sm font-medium text-slate-300">Explanation</h3>
      <p className="text-sm text-slate-200">{step.description}</p>
      {step.subLabel && (
        <p className="mt-1 text-xs text-slate-400">Phase: {step.subLabel}</p>
      )}
    </div>
  );
}
