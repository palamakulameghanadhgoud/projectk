# PROJECT K

Production-ready web platform for teaching Design and Analysis of Algorithms using interactive 3D visualizations and algorithm simulations.

## Features

- **Modular visualization engine**: Algorithm logic is decoupled from 3D rendering. Steps are generated as JSON and rendered by the engine.
- **Merge Sort** (first iteration): Full divide-and-conquer visualization with play/pause/step, speed control, and explanation panel.
- **Teacher / Student modes**: Student mode for guided learning; Teacher mode with annotations and pause-on-step.
- **REST API**: Health check and algorithm step generation endpoints.
- **Database-ready**: Prisma schema for Users, Saved Visualizations, Algorithm Configurations, Session History.

## Setup

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)
- PostgreSQL (optional; required only for persistence features)

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and set `DATABASE_URL` if you use the database:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/daa?schema=public"
```

If you skip the database, the app still runs: `prisma.config.ts` uses a fallback URL for `prisma generate`. Prisma is only required when you implement save/session APIs.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Go to **Merge Sort** to use the visualization.

### Build & start (production)

```bash
npm run build
npm start
```

## Project structure

```
/app                    # Next.js App Router pages
/components
  /3d-engine             # R3F canvas, Scene, algorithm-specific 3D (e.g. MergeSortBars)
  /algorithm-ui          # PlaybackControls, ExplanationPanel, InputControls, ViewModeToggle
/lib
  /algorithms            # Step generators (merge-sort, …)
  /types                 # VisualizationStep, config types
  /store                 # Zustand visualization store
  /hooks                 # usePlaybackLoop
/server                  # Shared server utilities (logger)
/prisma                  # Schema and migrations
/public
/docs                    # Architecture and how-to
```

## How to add a new algorithm

1. **Step generator**: In `lib/algorithms/<id>/`, implement a function that takes a config and returns `VisualizationStep<YourPayload>[]`.
2. **3D component**: In `components/3d-engine/<id>/`, create a component that receives the current step’s `payload` and renders with R3F.
3. **Wire up**: In `Scene.tsx`, branch on `algorithmId` and render your component. Export the generator from `lib/algorithms/index.ts` and add a case in `app/api/algorithms/[algorithmId]/steps/route.ts`.
4. **Page**: Add `app/algorithms/<id>/page.tsx` and link from the home page.

See `docs/architecture.md` for more detail.

## Deployment

- **Vercel**: Connect the repo; set `DATABASE_URL` if using DB. No extra config.
- **Docker**: A `Dockerfile` can be added to build and run `next start` behind a reverse proxy.
- **AWS**: Build with `npm run build`, run with `npm start` on ECS/EC2/Lambda (with Next.js standalone if needed).

## Performance

- 3D is lazy-loaded and not rendered on the server.
- Steps are precomputed; playback only advances an index.
- Keep bar/mesh lists memoized and avoid unnecessary state updates during animation.

## Security

- API routes validate input (e.g. `inputSize` clamped).
- Environment variables for secrets; no keys in client code.
- Middleware at `/api/*` is the placeholder for rate limiting (e.g. Upstash).

## License

Private / educational use.
