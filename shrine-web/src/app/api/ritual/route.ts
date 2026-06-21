import { NextResponse } from "next/server";
import { completeRitual } from "../../../../lib/services/ritual";
import { parseRitualRequest } from "../../../../lib/utils/validator";

export async function POST(request: Request) {
  try {
    const input = parseRitualRequest(await request.json());
    const result = await completeRitual(input);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "殿门刚刚晃了一下，请稍后再试。";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
