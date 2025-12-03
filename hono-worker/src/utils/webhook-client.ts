import { type WebhookPayload, generateWebhookSignature } from "./webhook";

export async function sendWebhookEvent(
  payload: WebhookPayload,
): Promise<void | Response> {
  const signature = generateWebhookSignature(payload);

  const webhookEndpoint = process.env.WEBHOOK_ENDPOINT;
  if (!webhookEndpoint) throw new Error("Webhook endpoint missing from env");

  return fetch(webhookEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": signature,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.info(
        `INFO: Webhook event sent with payload: ${JSON.stringify(payload)}`,
      );
      return response;
    })
    .catch((error) =>
      console.error(
        `ERROR: Webhook event errored: ${error} with payload: ${JSON.stringify(payload)}`,
      ),
    );
}
