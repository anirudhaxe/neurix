import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "openai/text-embedding-3-small",
  apiKey: process.env.AI_GATEWAY_API_KEY,
  configuration: {
    baseURL: "https://ai-gateway.vercel.sh/v1",
  },
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: "http://localhost:6333",
  collectionName: "neurix-vector-testing",
}).catch((error) => {
  console.error("ERROR: Error while loading vector store:", error.message);
});

export default vectorStore;
