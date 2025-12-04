import crypto, { randomUUID } from "crypto";

export interface WebhookPayload {
  provider: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  data: Record<string, any>;
}

export function generateWebhookSignature(payload: WebhookPayload): string {
  if (!process.env.WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET environment variable is not set");
  }
  const webhookSecret = process.env.WEBHOOK_SECRET;
  return crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

export function createWebhookPayload(
  eventType: string,
  data: Record<string, any>,
): WebhookPayload {
  return {
    provider: "opencontext-worker",
    eventId: randomUUID(),
    eventType,
    timestamp: new Date().toISOString(),
    data,
  };
}

