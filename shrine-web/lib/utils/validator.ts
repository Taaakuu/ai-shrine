export type RitualType = "thanks" | "divination";

export type RitualRequestInput = {
  ritualType: RitualType;
  userMessage?: string;
  sessionId?: string;
};

export function isRitualType(value: unknown): value is RitualType {
  return value === "thanks" || value === "divination";
}

export function parseRitualRequest(value: unknown): RitualRequestInput {
  if (!value || typeof value !== "object") {
    throw new Error("请以轻声入殿：仪式内容缺失。 ");
  }

  const body = value as Record<string, unknown>;

  if (!isRitualType(body.ritualType)) {
    throw new Error("这条仪式路径尚未开放。 ");
  }

  const userMessage = typeof body.userMessage === "string" ? body.userMessage.trim() : undefined;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : undefined;

  if (userMessage && userMessage.length > 240) {
    throw new Error("神前小笺请短一点，240 字以内就够了。 ");
  }

  return {
    ritualType: body.ritualType,
    userMessage,
    sessionId,
  };
}
