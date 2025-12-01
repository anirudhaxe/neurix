import { streamText, convertToModelMessages, stepCountIs, UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// initialize openrouter provider for ai sdk
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function llmCall({
  model,
  messages,
  stopWhen,
  tools,
}: {
  model: string;
  messages: UIMessage[];
  stopWhen: number;
  tools?: Record<string, any>;
}) {
  return streamText({
    // using openrouter provider
    model: openrouter(model),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(stopWhen),
    tools,
  });
}

export default llmCall;
