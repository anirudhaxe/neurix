import { UIMessage, createIdGenerator } from "ai";
import { llmCall } from "@/lib/ai/llm";
import { weatherTool, convertFahrenheitToCelsiusTool } from "@/lib/ai/tools";
import { trpc } from "@/trpc/server";

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();

  const previousMessages = await trpc.chat.loadChat({ chatId: id });

  // append latest message to previous messages
  const messages = [...previousMessages, message];

  const result = await llmCall({
    model: "kwaipilot/kat-coder-pro:free",
    messages,
    // TODO: pass this id dynamically once auth is implemented
    userId: "TEMPID9090",
    stopWhen: 5,
    tools: {
      weather: weatherTool(),
      convertFahrenheitToCelsius: convertFahrenheitToCelsiusTool(),
    },
    isRagCall: true,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    onFinish: ({ messages }) => {
      trpc.chat.saveChat({ userId: "TEMPID9090", chatId: id, messages });
    },
  });
}
