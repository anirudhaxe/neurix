import crypto, { randomUUID } from "crypto";

export interface WebhookPayload {
  provider: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  data: Record<string, any>;
}

export function generateWebhookSignature(payload: WebhookPayload): string {
  const webhookSecret = process.env.WEBHOOK_SECRET || "default-secret";
  return crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

export function createWebhookPayload(
  eventType: string,
  data: Record<string, any>
): WebhookPayload {
  return {
    provider: "neurix-worker",
    eventId: randomUUID(),
    eventType,
    timestamp: new Date().toISOString(),
    data,
  };
}