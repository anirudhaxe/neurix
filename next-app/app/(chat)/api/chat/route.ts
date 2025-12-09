import { UIMessage, createIdGenerator } from "ai";
import { llmCall } from "@/lib/ai/llm";
import { weatherTool, convertFahrenheitToCelsiusTool } from "@/lib/ai/tools";
import { trpc } from "@/trpc/server";
import auth from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage; id: string } = await req.json();

  const previousMessages = await trpc.chat.loadChat({ chatId: id });

  // access session on server side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // TODO: handle this error later
  if (!session?.session)
    return Response.json({ message: "Not authorized" }, { status: 500 });

  // append latest message to previous messages
  const messages = [...(previousMessages || []), message];

  const result = await llmCall({
    model: "kwaipilot/kat-coder-pro:free",
    messages,
    userId: session.user.id,
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
    onFinish: async ({ messages }) => {
      await trpc.chat.saveChat({
        userId: session.user.id,
        chatId: id,
        messages,
      });
    },
  });
}
