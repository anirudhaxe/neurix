import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
  createIdGenerator,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import { saveChat } from "@/lib/chat-store";

// initialize openrouter provider for ai sdk
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, id }: { messages: UIMessage[]; id: string } =
    await req.json();

  const result = streamText({
    // using openrouter provider
    model: openrouter("x-ai/grok-4.1-fast:free"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        inputSchema: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius",
        inputSchema: z.object({
          temperature: z
            .number()
            .describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
