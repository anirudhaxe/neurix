import { Document } from "langchain";
import crypto from "crypto";
import textSplitter from "../text-splitter";

const convertRawTextToDocuments = async ({
  textData,
  userId,
  jobId,
  jobName,
}: {
  textData: string;
  userId: string;
  jobId: string;
  jobName: string;
}): Promise<{ documents: Document[]; ids: string[] }> => {
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

  return {
    documents,
    ids,
  };
};

export default convertRawTextToDocuments;
