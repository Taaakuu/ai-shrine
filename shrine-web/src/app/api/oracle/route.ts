import { NextResponse } from "next/server";
import { generateOracle } from "../../../../lib/services/oracle";
import { parseRitualRequest } from "../../../../lib/utils/validator";

export async function POST(request: Request) {
  try {
    const input = parseRitualRequest(await request.json());

    return NextResponse.json(generateOracle(input.ritualType, input.userMessage));
  } catch (error) {
    const message = error instanceof Error ? error.message : "神前回音暂时没有落下。";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
