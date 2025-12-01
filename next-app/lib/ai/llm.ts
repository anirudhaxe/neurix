import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  UIMessage,
  wrapLanguageModel,
  generateObject,
  generateText,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { conditionalRagMiddleware } from "./middleware/rag-middleware";

// initialize openrouter provider for ai sdk
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// default llm call function to run main completion inference, with optional RAG. Streams back the response.
// using openrouter provider for inference
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

// classifier call function to run classifier inference
// using ai gateway for inference
async function classiferCall({ prompt }: { prompt: string }) {
  return generateObject({
    // fast model for classification:
    model: "openai/gpt-4o-mini",
    output: "enum",
    enum: ["question", "statement", "other"],
    system: "classify the user message as a question, statement, or other",
    prompt,
  });
}

// generate text call function. Generates text without streaming. Meant for quick secondary generations
// using ai gateway for inference
async function generateTextCall({ prompt }: { prompt: string }) {
  return generateText({
    model: "openai/gpt-4o-mini",
    system: "Answer the users question:",
    prompt,
  });
}

export { llmCall, classiferCall, generateTextCall };
