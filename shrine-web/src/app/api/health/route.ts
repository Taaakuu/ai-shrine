import { NextResponse } from "next/server";
import { canUseDatabase } from "../../../../lib/db/client";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ai-shrine",
    database: canUseDatabase() ? "configured" : "memory-fallback",
    checkedAt: new Date().toISOString(),
  });
}
