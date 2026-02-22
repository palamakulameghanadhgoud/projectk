# Architecture

## Overview

- **Frontend**: Next.js (App Router), TypeScript, React Three Fiber, TailwindCSS, Zustand, Framer Motion.
- **Visualization**: Step-based engine; algorithm logic produces JSON steps, 3D components render the current step.
- **Backend**: Next.js API routes (REST), Prisma + PostgreSQL for persistence (schema ready).

## Data Flow

1. **Algorithm config** (e.g. input size) → **Step generator** (in `lib/algorithms/*`) → `VisualizationStep[]`.
2. Store holds `steps` and `currentStepIndex`. Playback advances the index.
3. **Scene** reads current step from store and renders the matching 3D component (e.g. `MergeSortBars`).

## Adding a New Algorithm

1. Add folder `lib/algorithms/<algorithm-id>/`: `types.ts`, `step-generator.ts`, `index.ts`.
2. Implement step generator: from config → `VisualizationStep<YourPayload>[]`.
3. Add 3D component in `components/3d-engine/<algorithm-id>/` that accepts `payload`.
4. Register in `components/3d-engine/Scene.tsx`: when `algorithmId === "<algorithm-id>"` render your component.
5. Export from `lib/algorithms/index.ts` and add API case in `app/api/algorithms/[algorithmId]/steps/route.ts`.
6. Add a page under `app/algorithms/<algorithm-id>/page.tsx` and link from home.

## Performance

- 3D canvas is lazy-loaded (dynamic import, no SSR).
- Steps are precomputed; no heavy work during playback.
- Use `useMemo` in 3D components for bar/mesh lists. Cleanup is automatic via React/Three.
