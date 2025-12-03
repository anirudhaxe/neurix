import crypto from "crypto";

export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
}

export function verifyWebhookSignature(
  payload: any,
  signature: string | null,
): WebhookVerificationResult {
  if (!signature) {
    return { isValid: false, error: "Invalid webhook signature" };
  }

  const webhookSecret = process.env.WEBHOOK_SECRET || "default-secret";
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
  payload: any;
  signature: string | null;
}> {
  const payload = await request.json();
  const signature = request.headers.get("x-signature");

  return {
    payload,
    signature,
  };
}

