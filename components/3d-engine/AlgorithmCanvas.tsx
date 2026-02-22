"use client";

/**
 * Client-only wrapper that mounts React Three Fiber canvas.
 * Use dynamic import to avoid SSR issues with Three.js.
 */

import dynamic from "next/dynamic";
import { useRef, useState, useCallback, useEffect } from "react";

const CanvasInner = dynamic(
  () => import("./AlgorithmCanvasInner").then((m) => m.AlgorithmCanvasInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-900/50 text-slate-400">
        Loading 3D…
      </div>
    ),
  }
);

export function AlgorithmCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full min-h-[320px] rounded-lg overflow-hidden bg-slate-900/80"
    >
      <CanvasInner />
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-2 top-2 rounded bg-slate-700/90 p-2 text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
        title={isFullscreen ? "Exit full screen" : "Full screen"}
        aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
      >
        {isFullscreen ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6m0 0v6m0-6l-4 4M20 10h-6m0 0V4m0 6l4 4M10 4h4v4m0 4l4-4M14 20h-4v-4m0-4l-4 4" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m0 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
    </div>
  );
}
