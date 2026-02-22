"use client";

import { AlgorithmCanvas } from "@/components/3d-engine";
import {
  DijkstraInputControls,
  PlaybackControls,
  ExplanationPanel,
  ViewModeToggle,
} from "@/components/algorithm-ui";
import { usePlaybackLoop } from "@/lib/hooks/usePlaybackLoop";

export default function DijkstraPage() {
  usePlaybackLoop();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Dijkstra Shortest Path</h1>
          <p className="text-sm text-slate-400">Greedy • Nodes = spheres, edges = lines</p>
        </div>
        <ViewModeToggle />
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <DijkstraInputControls />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-[420px] w-full">
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
