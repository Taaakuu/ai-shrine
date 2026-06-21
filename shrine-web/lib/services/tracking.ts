import { createRitualEvent } from "../db/queries";

export async function trackTempleEvent(eventType: string, sessionId?: string) {
  return createRitualEvent({
    eventType,
    sessionId,
  });
}
