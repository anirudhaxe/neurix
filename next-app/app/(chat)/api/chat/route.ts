import { UIMessage, createIdGenerator } from "ai";
import { loadChat, saveChat } from "@/lib/chat-store";
import llmCall from "@/lib/ai/llm";
import { weatherTool, convertFahrenheitToCelsiusTool } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();

  const previousMessages = await loadChat(id);

  // append latest message to previous messages
  const messages = [...previousMessages, message];

  const result = await llmCall({
    model: "x-ai/grok-4.1-fast:free",
    messages,
    stopWhen: 5,
    tools: {
      weather: weatherTool(),
      convertFahrenheitToCelsius: convertFahrenheitToCelsiusTool(),
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
