import { NextRequest, NextResponse } from "next/server";
import { generateDijkstraSteps, generateMergeSortSteps, generateMSTSteps } from "@/lib/algorithms";

/**
 * POST /api/algorithms/[algorithmId]/steps
 * Body: algorithm-specific config
 * Returns: { steps: VisualizationStep[] }
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ algorithmId: string }> }
) {
  const { algorithmId } = await params;

  try {
    if (algorithmId === "merge-sort") {
      const body = await _request.json();
      const inputSize = Number(body?.inputSize) || 8;
      const steps = generateMergeSortSteps({
        inputSize: Math.min(32, Math.max(2, inputSize)),
        values: Array.isArray(body?.values) ? body.values : undefined,
      });
      return NextResponse.json({ steps });
    }

    if (algorithmId === "dijkstra") {
      const body = await _request.json();
      const nodeIds = Array.isArray(body?.nodeIds) ? body.nodeIds : ["A", "B", "C", "D"];
      const edges = Array.isArray(body?.edges)
        ? body.edges
        : [
            { from: "A", to: "B", weight: 4 },
            { from: "A", to: "C", weight: 2 },
            { from: "B", to: "C", weight: 1 },
            { from: "B", to: "D", weight: 5 },
            { from: "C", to: "D", weight: 8 },
          ];
      const sourceId = typeof body?.sourceId === "string" ? body.sourceId : nodeIds[0];
      const steps = generateDijkstraSteps({ nodeIds, edges, sourceId });
      return NextResponse.json({ steps });
    }

    if (algorithmId === "mst") {
      const body = await _request.json();
      const nodeIds = Array.isArray(body?.nodeIds) ? body.nodeIds : ["A", "B", "C", "D"];
      const edges = Array.isArray(body?.edges)
        ? body.edges
        : [
            { from: "A", to: "B", weight: 4 },
            { from: "A", to: "C", weight: 2 },
            { from: "B", to: "C", weight: 1 },
            { from: "B", to: "D", weight: 5 },
            { from: "C", to: "D", weight: 8 },
          ];
      const steps = generateMSTSteps({ nodeIds, edges });
      return NextResponse.json({ steps });
    }

    return NextResponse.json(
      { error: "Algorithm not found", algorithmId },
      { status: 404 }
    );
  } catch (err) {
    console.error("[algorithms/steps]", err);
    return NextResponse.json(
      { error: "Failed to generate steps" },
      { status: 500 }
    );
  }
}
