import {
  createChat,
  getChatFromDb,
  getChatMessagesFromDb,
  insertMessages,
} from "@/db/chat";
import { UIMessage } from "ai";

export async function loadChat(chatId: string): Promise<UIMessage[]> {
  // First get the chat record to find the database ID
  const chatRecord = await getChatFromDb({ chatId });

  if (chatRecord.length === 0) {
    return [];
  }

  // Get all messages for this chat
  const messages = await getChatMessagesFromDb({ chatDbId: chatRecord[0].id });

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
  userId,
  chatId,
  messages,
}: {
  userId: string;
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  if (messages.length > 0) {
    let chatDbId = "";
    const res = await getChatFromDb({ chatId });

    // if no existing chat found, create a new chat
    if (res.length === 0) {
      const result = await createChat({
        userId,
        chatId,
        title: "GENERATE THIS TITLE",
      });
      chatDbId = result[0].id;
    } else {
      chatDbId = res[0].id;
    }
    // insert the last two messages in the message table
    await insertMessages({
      values: messages.slice(-2).map((msg) => ({
        messageId: msg.id,
        chatDbId,
        role: msg.role,
        parts: msg.parts,
        attachments: [], // UIMessage doesn't have attachments, use empty array
      })),
    });
  }
}
