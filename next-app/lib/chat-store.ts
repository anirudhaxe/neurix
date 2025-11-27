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

export async function loadChat(chatId: string): Promise<UIMessage[]> {
  // First get the chat record to find the database ID
  const chatRecord = await db
    .select()
    .from(chat)
    .where(eq(chat.chatId, chatId))
    .limit(1);

  if (chatRecord.length === 0) {
    return [];
  }

  // Get all messages for this chat
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatDbId, chatRecord[0].id))
    .orderBy(message.createdAt);

  // Convert database messages to UIMessage format
  return messages.map((msg) => ({
    id: msg.messageId,
    role: msg.role as "user" | "assistant" | "system",
    // TODO: fix the parts type
    // eslint-disable-next-line
    parts: msg.parts as any[],
  }));
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  if (messages.length > 0) {
    const res = await db
      .select({ chatDbId: chat.id })
      .from(chat)
      .where(eq(chat.chatId, chatId))
      .limit(1);

    // insert the last two messages in the message table
    await db.insert(message).values(
      messages.slice(-2).map((msg) => ({
        messageId: msg.id,
        chatDbId: res[0].chatDbId,
        role: msg.role,
        parts: msg.parts,
        attachments: [], // UIMessage doesn't have attachments, use empty array
      })),
    );
  }
}
