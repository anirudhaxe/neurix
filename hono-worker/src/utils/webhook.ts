import crypto, { randomUUID } from "crypto";
import { type webhookEventType } from "./webhook-types";

export function generateWebhookSignature(payload: webhookEventType): string {
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
  eventType: webhookEventType["eventType"],
  data: webhookEventType["data"],
): webhookEventType {
  return {
    provider: "opencontext-worker",
    eventId: randomUUID(),
    eventType,
    timestamp: new Date().toISOString(),
    data,
  };
}
