import { webhookEventSchema } from "@/app/(webhooks)/webhooks-config";
import crypto from "crypto";
import z from "zod";

export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

export function verifyWebhookSignature(
  payload: z.infer<typeof webhookEventSchema>,
  signature: string | null,
): WebhookVerificationResult {
  if (!signature) {
    return { isValid: false, error: "Invalid webhook signature" };
  }

  if (!process.env.WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET environment variable is not set");
  }
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (signature !== expectedSignature) {
    return {
      isValid: false,
      error: "Invalid webhook signature",
    };
  }

  return { isValid: true };
}

export async function extractWebhookData(request: Request): Promise<{
  payload: z.infer<typeof webhookEventSchema>;
  signature: string | null;
}> {
  const payload = await request.json();
  const signature = request.headers.get("x-signature");

  return {
    payload,
    signature,
  };
}
