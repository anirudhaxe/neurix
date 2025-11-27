import db from "@/db";
import { chat, message } from "@/db/schema/base-schema";
import { generateId, UIMessage } from "ai";
import { eq } from "drizzle-orm";

export async function createChat(): Promise<string> {
  const id = generateId();

  const returnedChatIds = await db
    .insert(chat)
    .values({ chatId: id, title: "Random chat title" })
    .returning({ chatId: chat.chatId });

  return returnedChatIds[0].chatId;
}

export async function loadChat(chatId: string): Promise<UIMessage[]> {}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {}
