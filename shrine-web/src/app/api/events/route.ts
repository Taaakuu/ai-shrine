import { NextResponse } from "next/server";
import { trackTempleEvent } from "../../../../lib/services/tracking";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventType = typeof body.eventType === "string" ? body.eventType : "temple_event";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : undefined;
    const event = await trackTempleEvent(eventType, sessionId);

    return NextResponse.json({ id: event.id, ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error: "这枚脚印没有留住，请稍后再试。",
      },
      { status: 400 },
    );
  }
}
