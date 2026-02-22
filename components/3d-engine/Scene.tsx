"use client";

/**
 * Root 3D scene. Renders the current algorithm step via step-driven components.
 */

import { OrbitControls } from "@react-three/drei";
import type { GraphStepPayload } from "@/lib/algorithms/graph-types";
import type { MergeSortStepPayload } from "@/lib/algorithms/merge-sort";
import { useVisualizationStore } from "@/lib/store";
import { GraphVisualization } from "./graph/GraphVisualization";
import { MergeSortBars } from "./merge-sort/MergeSortBars";
import { MergeSortTree } from "./merge-sort/MergeSortTree";
import { MergeSortTreeCamera } from "./merge-sort/MergeSortTreeCamera";

function LightsAndFloor() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-4, 4, -4]} intensity={0.3} />
      {/* Ground plane for depth and shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[24, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.9} />
      </mesh>
    </>
  );
}

export function Scene() {
  const { steps, currentStepIndex, algorithmId, mergeSortViewMode, mergeSortAutoCamera } =
    useVisualizationStore();
  const step = steps[currentStepIndex];
  const useFollowCamera =
    algorithmId === "merge-sort" && mergeSortViewMode === "tree" && mergeSortAutoCamera;

  if (!step || !algorithmId) {
    return (
      <>
        <LightsAndFloor />
        <OrbitControls enableZoom enableRotate enablePan />
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </>
    );
  }

  const payload = step?.payload;
  return (
    <>
      <LightsAndFloor />
      {useFollowCamera ? <MergeSortTreeCamera /> : <OrbitControls enableZoom enableRotate enablePan />}
      {algorithmId === "merge-sort" &&
        (mergeSortViewMode === "tree" ? (
          <MergeSortTree payload={(payload ?? {}) as MergeSortStepPayload} />
        ) : (
          <MergeSortBars payload={(payload ?? {}) as MergeSortStepPayload} />
        ))}
      {(algorithmId === "dijkstra" || algorithmId === "mst") && (
        <GraphVisualization payload={(payload ?? {}) as GraphStepPayload} />
      )}
    </>
  );
}
