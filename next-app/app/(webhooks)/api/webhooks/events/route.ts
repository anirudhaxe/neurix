import { webhookEventSchema } from "@/app/(webhooks)/webhooks-config";
import { updateJobStatus } from "@/db/job";
import { handleApiError } from "@/lib/utils";
import {
  verifyWebhookSignature,
  extractWebhookData,
} from "@/lib/webhook/verification";

export async function POST(request: Request) {
  try {
    const { payload, signature } = await extractWebhookData(request);

    // Verify webhook signature
    const verification = verifyWebhookSignature(payload, signature);
    if (!verification.isValid) {
      return Response.json({ error: verification.error }, { status: 401 });
    }

    const { success, data } = webhookEventSchema.safeParse(payload);

    if (!success) {
      return Response.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }
    switch (data.eventType) {
      case "job.status.changed":
        await updateJobStatus({
          jobId: data.data.jobId,
          status: data.data.status,
        });

        break;

      default:
        return Response.json(
          { error: "Unimplemented event type" },
          { status: 400 },
        );
    }

    return Response.json({
      received: "ok",
    });
  } catch (error) {
    return handleApiError(error, "POST /api/webhooks/events");
  }
}
