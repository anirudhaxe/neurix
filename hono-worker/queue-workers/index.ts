import { Worker } from "bullmq";
import kvConnection from "../kv";
import { createWebhookPayload } from "../src/utils/webhook";
import { sendWebhookEvent } from "../src/utils/webhook-client";
import vectorStore from "../src/lib/vector-store";
import convertRawTextToDocuments from "../src/lib/data-processors/textToDocuments";

const jobQueueWorker = new Worker(
  "jobQueue",
  async (job) => {
    const {
      userId,
      jobId,
      jobName,
      textData,
      jobType,
      jobUrl,
    }: {
      userId: string;
      jobId: string;
      jobName: string;
      textData: string;
      jobType: "txt" | "video" | "doc";
      jobUrl: string;
    } = job.data;

    try {
      // Send webhook event for status change to PROCESSING
      await sendWebhookEvent(
        createWebhookPayload("job.status.changed", {
          jobId,
          status: "PROCESSING",
        }),
      );

      // Mark the job in ERROR and return if connection to vector store is not established
      if (!vectorStore) {
        console.error(
          "ERROR: Vector store connection not available, cannot process job:",
          jobId,
        );
        await sendWebhookEvent(
          createWebhookPayload("job.status.changed", {
            jobId,
            status: "ERROR",
          }),
        );

        return;
      }

      // TODO: handle the video job logic here
      if (jobType === "video") {
        console.info("VIDEO JOB RECEIVED: ", {
          userId,
          jobId,
          jobName,
          textData,
          jobType,
          jobUrl,
        });

        // Send webhook event for status change to PROCESSED
        await sendWebhookEvent(
          createWebhookPayload("job.status.changed", {
            jobId,
            status: "PROCESSED",
          }),
        );

        return;
      }
      const { documents, ids } = await convertRawTextToDocuments({
        textData,
        userId,
        jobId,
        jobName,
      });

      await vectorStore.addDocuments(documents, { ids });

      console.info(
        `INFO: DOCUMENTS FOR JOB ${jobId} BY USER ${userId} ADDED TO VECTOR STORE`,
      );

      // Send webhook event for status change to PROCESSED
      await sendWebhookEvent(
        createWebhookPayload("job.status.changed", {
          jobId,
          status: "PROCESSED",
        }),
      );
    } catch (error) {
      console.error("ERROR: WHILE STORING VECTORS: ", error);
      // Send webhook event for status change to ERROR
      await sendWebhookEvent(
        createWebhookPayload("job.status.changed", {
          jobId,
          status: "ERROR",
        }),
      );
    }
  },
  {
    connection: kvConnection,
  },
);

export { jobQueueWorker };
