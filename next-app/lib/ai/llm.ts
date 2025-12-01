import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  UIMessage,
  wrapLanguageModel,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { conditionalRagMiddleware } from "./middleware/rag-middleware";

// initialize openrouter provider for ai sdk
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// default llm call function to run main completion inference, with optional RAG
async function llmCall({
  model,
  messages,
  stopWhen,
  tools,
  isRagCall = false,
}: {
  model: string;
  messages: UIMessage[];
  stopWhen: number;
  tools?: Record<string, any>;
  isRagCall?: Boolean;
}) {
  return streamText({
    // using openrouter provider for inference
    // if RAG call, use RAG middleware
    model: isRagCall
      ? wrapLanguageModel({
          model: openrouter(model),
          middleware: conditionalRagMiddleware,
        })
      : openrouter(model),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(stopWhen),
    tools,
  });
}

export default llmCall;
