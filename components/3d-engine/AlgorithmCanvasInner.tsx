"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Scene } from "./Scene";

export function AlgorithmCanvasInner() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
      }}
      camera={{ position: [6, 4, 10], fov: 45 }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
