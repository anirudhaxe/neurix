import { Worker } from "bullmq";
import kvConnection from "../kv";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const jobQueueWorker = new Worker(
  "jobQueue",
  async (job) => {
    try {
      // This splitter will recursively split the document using common separators like new lines until each chunk is of appropriate size.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, // split in chunks of 1000 characters
        chunkOverlap: 200, // 200 characters overlap between the chunks. The overlap helps mitigate the possibility of separating a statement from important context related to it.
      });

      const splittedtext = await textSplitter.splitText(job.data.textData);

      // create langchain documents from splited text
      const documents = splittedtext.map(
        (text) => new Document({ pageContent: text }),
      );

      console.log("CREATED DOCUMENTS LENGTH: ", documents.length);

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

      await vectorStore.addDocuments(documents);

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
