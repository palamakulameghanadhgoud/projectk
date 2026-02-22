import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global middleware.
 * Add rate limiting here (e.g. via upstash/ratelimit) when needed.
 */
export function middleware(request: NextRequest) {
  // Rate limiting placeholder: integrate with Redis/Upstash in production
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
