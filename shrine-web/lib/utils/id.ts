export function createSessionId() {
  return `sess_${crypto.randomUUID()}`;
}
