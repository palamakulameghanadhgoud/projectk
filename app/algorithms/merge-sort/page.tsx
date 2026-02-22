"use client";

import { AlgorithmCanvas } from "@/components/3d-engine";
import {
  MergeSortCameraToggle,
  MergeSortViewToggle,
  PlaybackControls,
  ExplanationPanel,
  InputControls,
  ViewModeToggle,
} from "@/components/algorithm-ui";
import { usePlaybackLoop } from "@/lib/hooks/usePlaybackLoop";

export default function MergeSortPage() {
  usePlaybackLoop();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Merge Sort</h1>
          <p className="text-sm text-slate-400">Divide & Conquer • Bar chart or recursion tree</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <MergeSortViewToggle />
          <MergeSortCameraToggle />
          <ViewModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <InputControls />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-[400px] w-full">
              <AlgorithmCanvas />
            </div>
          </div>
          <div className="space-y-4">
            <ExplanationPanel />
          </div>
        </div>

        <PlaybackControls />
      </main>
    </div>
  );
}
