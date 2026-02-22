import { NextResponse } from "next/server";

/**
 * Health check for deployment and load balancers.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "daa-platform",
    timestamp: new Date().toISOString(),
  });
}
