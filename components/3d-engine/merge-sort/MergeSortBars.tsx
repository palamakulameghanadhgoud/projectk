"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { BarState } from "@/lib/algorithms/merge-sort";

interface MergeSortBarsProps {
  payload: { array: BarState[] };
}

const BAR_WIDTH = 0.4;
const BAR_DEPTH = 0.5;
const BAR_SPACING = 0.12;
const MAX_HEIGHT = 4;
const LERP = 0.18;

function colorForState(state: BarState["state"]): string {
  switch (state) {
    case "compare":
      return "#f59e0b";
    case "selected":
      return "#3b82f6";
    case "merged":
      return "#22c55e";
    case "pivot":
      return "#a855f7";
    default:
      return "#64748b";
  }
}

function valueToHeight(value: number): number {
  return (value / 20) * MAX_HEIGHT || 0.25;
}

interface AnimatedBarProps {
  targetValue: number;
  targetState: BarState["state"];
  index: number;
  total: number;
}

function AnimatedBar({ targetValue, targetState, index, total }: AnimatedBarProps) {
  const groupRef = useRef<Group>(null);
  const currentValueRef = useRef(targetValue);
  const x = (index - (total - 1) / 2) * (BAR_WIDTH + BAR_SPACING);

  useFrame(() => {
    if (!groupRef.current) return;
    currentValueRef.current += (targetValue - currentValueRef.current) * LERP;
    const height = valueToHeight(currentValueRef.current);
    groupRef.current.position.y = -2.5 + height / 2;
    groupRef.current.scale.y = height;
  });

  const initialHeight = valueToHeight(targetValue);
  const color = colorForState(targetState);

  return (
    <group
      ref={groupRef}
      position={[x, -2.5 + initialHeight / 2, 0]}
      scale={[1, initialHeight, 1]}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BAR_WIDTH, 1, BAR_DEPTH]} />
        <meshStandardMaterial
          color={color}
          metalness={0.15}
          roughness={0.65}
          flatShading={false}
        />
      </mesh>
      <Html position={[0, 0.55, 0]} center distanceFactor={8}>
        <span className="text-sm font-bold text-white drop-shadow-md">{targetValue}</span>
      </Html>
    </group>
  );
}

export function MergeSortBars({ payload }: MergeSortBarsProps) {
  const array = payload?.array ?? [];

  return (
    <group>
      {array.map((state, i) => (
        <AnimatedBar
          key={i}
          targetValue={state.value}
          targetState={state.state}
          index={i}
          total={array.length}
        />
      ))}
    </group>
  );
}
