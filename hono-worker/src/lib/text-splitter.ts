import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// This splitter will recursively split the document using common separators like new lines until each chunk is of appropriate size.
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // split in chunks of 1000 characters
  chunkOverlap: 200, // 200 characters overlap between the chunks. The overlap helps mitigate the possibility of separating a statement from important context related to it.
});

export default textSplitter;
