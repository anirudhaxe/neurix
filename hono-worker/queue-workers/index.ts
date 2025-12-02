import { Worker } from "bullmq";
import kvConnection from "../kv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import crypto from "crypto";

const jobQueueWorker = new Worker(
  "jobQueue",
  async (job) => {
    try {
      // This splitter will recursively split the document using common separators like new lines until each chunk is of appropriate size.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, // split in chunks of 1000 characters
        chunkOverlap: 200, // 200 characters overlap between the chunks. The overlap helps mitigate the possibility of separating a statement from important context related to it.
      });

      // TODO: add code organization and logging here
      const { userId, jobId, jobName, textData } = job.data;
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
          collectionName: "neurix-vector-testing",
        },
      );

      await vectorStore.addDocuments(documents, { ids });

      console.info(
        "INFO: DOCUMENT ADDED TO VECTOR STORE, SEMANTIC SEARCH ENGINE READY",
      );
    } catch (error) {
      console.error("ERROR: WHILE STORING VECTORS: ", error);
    }
  },
  {
    connection: kvConnection,
  },
);

export { jobQueueWorker };
