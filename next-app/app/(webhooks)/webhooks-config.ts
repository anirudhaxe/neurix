import z from "zod";

// providers
const providers = ["neurix-worker"];

// event types
const jobEventTypes = ["job.status.changed"];

const webhookEventSchema = z.object({
  provider: z.enum(providers),
  eventId: z.uuid(),
  // spread more eventTypes here if required
  eventType: z.enum([...jobEventTypes]),
  timestamp: z.iso.datetime(),
  data: z.record(z.string(), z.any()),
});

export { webhookEventSchema };
