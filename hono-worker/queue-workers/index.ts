import { Worker } from "bullmq";
import kvConnection from "../kv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createWebhookPayload } from "../src/utils/webhook";
import { sendWebhookEvent } from "../src/utils/webhook-client";
import crypto from "crypto";

const jobQueueWorker = new Worker(
  "jobQueue",
  async (job) => {
    const { userId, jobId, jobName, textData } = job.data;
    try {
      // Send webhook event for status change to PROCESSING
      await sendWebhookEvent(
        createWebhookPayload("job.status.changed", {
          jobId,
          status: "PROCESSING",
        }),
      );

      // This splitter will recursively split the document using common separators like new lines until each chunk is of appropriate size.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, // split in chunks of 1000 characters
        chunkOverlap: 200, // 200 characters overlap between the chunks. The overlap helps mitigate the possibility of separating a statement from important context related to it.
      });

      // TODO: add code organization and logging here
      const splittedtext = await textSplitter.splitText(textData);

      const documents = [];
      const ids = [];

      for (const chunk of splittedtext) {
        // Deterministic ID = jobId + hash(chunkText)
        const hash = crypto
          .createHash("md5")
          .update(jobId + chunk)
          .digest("hex");

        ids.push(hash);

        documents.push(
          new Document({
            pageContent: chunk,
            metadata: {
              userId,
              jobId,
              jobName,
            },
          }),
        );
      }

      // initialize embeddings model instance
      const embeddings = new OpenAIEmbeddings({
        model: "openai/text-embedding-3-small",
        apiKey: process.env.AI_GATEWAY_API_KEY,
        configuration: {
          baseURL: "https://ai-gateway.vercel.sh/v1",
        },
      });

      // initialize the vector store and add documents
      const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
          url: "http://localhost:6333",
          collectionName: process.env.VECTOR_DB_COLLECTION,
        },
      );

      await vectorStore.addDocuments(documents, { ids });

      console.info(
        "INFO: DOCUMENT ADDED TO VECTOR STORE, SEMANTIC SEARCH ENGINE READY",
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
