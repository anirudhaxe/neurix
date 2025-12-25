import { Worker } from "bullmq";
import kvConnection from "../kv";
import { createWebhookPayload } from "../src/utils/webhook";
import { sendWebhookEvent } from "../src/utils/webhook-client";
import vectorStore from "../src/lib/vector-store";
import convertRawTextToDocuments from "../src/lib/data-processors/textToDocuments";
import transcribeYtVideo from "../src/lib/data-processors/video-processor/ytUrlTranscriber";

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

      let rawTextData;

      // for job type video, use transcriptions as raw text
      if (jobType === "video") {
        console.info("INFO: Video job received: ", {
          userId,
          jobId,
          jobName,
          textData,
          jobType,
          jobUrl,
        });

        rawTextData = await transcribeYtVideo(jobUrl);
      } else {
        // for job type !video, use textData provided in job as raw text
        rawTextData = textData;
      }

      if (!rawTextData) {
        await sendWebhookEvent(
          createWebhookPayload("job.status.changed", {
            jobId,
            status: "ERROR",
          }),
        );
        return;
      }

      const { documents, ids } = await convertRawTextToDocuments({
        textData: rawTextData,
        userId,
        jobId,
        jobName,
      });

      await vectorStore.addDocuments(documents, { ids });

      console.info(
        `INFO: Documents for job ${jobId} by user ${userId} added to vector store`,
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
    lockDuration: 1800000, // 30 minutes in ms
    lockRenewTime: 60000, // Renew every 60 seconds
  },
);

export { jobQueueWorker };
