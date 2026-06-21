import { canUseDatabase, getPrisma } from "./client";

export type RitualEventRecord = {
  id: string;
  sessionId: string | null;
  eventType: string;
  godName: string | null;
  userMessage: string | null;
  resultText: string | null;
  createdAt: Date;
};

export type CreateRitualEventInput = {
  sessionId?: string;
  eventType: string;
  godName?: string;
  userMessage?: string;
  resultText?: string;
};

const memoryEvents = new Map<string, RitualEventRecord>();

function createMemoryEvent(input: CreateRitualEventInput): RitualEventRecord {
  const event: RitualEventRecord = {
    id: crypto.randomUUID(),
    sessionId: input.sessionId ?? null,
    eventType: input.eventType,
    godName: input.godName ?? null,
    userMessage: input.userMessage ?? null,
    resultText: input.resultText ?? null,
    createdAt: new Date(),
  };

  memoryEvents.set(event.id, event);
  return event;
}

export async function createRitualEvent(input: CreateRitualEventInput) {
  if (!canUseDatabase()) {
    return createMemoryEvent(input);
  }

  try {
    return await getPrisma().ritualEvent.create({
      data: {
        sessionId: input.sessionId,
        eventType: input.eventType,
        godName: input.godName,
        userMessage: input.userMessage,
        resultText: input.resultText,
      },
    });
  } catch (error) {
    console.warn("RitualEvent database write failed; falling back to memory.", error);
    return createMemoryEvent(input);
  }
}

export async function getRitualEventById(id: string) {
  const memoryEvent = memoryEvents.get(id);
  if (memoryEvent) {
    return memoryEvent;
  }

  if (!canUseDatabase()) {
    return null;
  }

  try {
    return await getPrisma().ritualEvent.findUnique({
      where: { id },
    });
  } catch (error) {
    console.warn("RitualEvent database read failed.", error);
    return null;
  }
}
