"use server";

import { getChatsAndPreviewMessageFromDb } from "@/db/chat";
import { generateId } from "ai";
import { redirect } from "next/navigation";

export const handleNewChat = async () => {
  // generate a new chat id
  const id = generateId();
  redirect(`/chat/${id}`);
};

export const getChats = async ({ userId }: { userId: string }) => {
  const result = await getChatsAndPreviewMessageFromDb({ userId });

  return result.map((chat) => {
    let preview = "";

    if (Array.isArray(chat.latestMessage?.parts)) {
      preview = chat.latestMessage?.parts[0]?.text || "";
    }

    return {
      id: chat.chatId,
      title: chat.title,
      preview,
      // timestamp: chat.updatedAt,
      timestamp: "1 day ago",
    };
  });
};
