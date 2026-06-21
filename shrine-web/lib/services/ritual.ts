import { createRitualEvent, getRitualEventById } from "../db/queries";
import { generateOracle } from "./oracle";
import type { RitualRequestInput } from "../utils/validator";

export async function completeRitual(input: RitualRequestInput) {
  const oracle = generateOracle(input.ritualType, input.userMessage);
  const resultLabel = oracle.fortuneName
    ? `${oracle.fortuneName}｜${oracle.mood}｜${oracle.resultText}`
    : oracle.resultText;

  const event = await createRitualEvent({
    sessionId: input.sessionId,
    eventType: input.ritualType,
    godName: oracle.godName,
    userMessage: input.userMessage,
    resultText: resultLabel,
  });

  return {
    id: event.id,
    ritualType: event.eventType,
    godName: oracle.godName,
    userMessage: input.userMessage ?? "",
    resultText: oracle.resultText,
    fortuneName: oracle.fortuneName,
    mood: oracle.mood,
    createdAt: event.createdAt,
  };
}

export async function getRitualResult(id: string) {
  return getRitualEventById(id);
}
