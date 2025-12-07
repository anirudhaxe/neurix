import { z } from "zod";
import {
  publicProcedure,
  // protectedProcedure,
  createTRPCRouter,
} from "@/trpc/init";

import {
  createChat,
  getChatFromDb,
  getChatMessagesFromDb,
  insertMessages,
  getChatsAndPreviewMessageFromDb,
  deleteChatFromDb,
  updateChatTitleInDb,
} from "@/db/chat";
import { generateTextCall } from "@/lib/ai/llm";

// Zod schema for UIMessage
const UIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(z.any()), // UIMessagePart can be complex, using z.any() for flexibility
});

export const chatRouteController = createTRPCRouter({
  getChats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const result = await getChatsAndPreviewMessageFromDb({
        userId: input.userId,
      });

      return result.map((chat) => {
        let preview = "";

        if (Array.isArray(chat.latestMessage?.parts)) {
          preview = chat.latestMessage?.parts[0]?.text || "";
        }

        return {
          id: chat.chatId,
          title: chat.title,
          preview,
          // TODO: implement this type stamp text
          // timestamp: chat.updatedAt,
          timestamp: "1 day ago",
        };
      });
    }),
  loadChat: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      // First get the chat record to find the database ID
      const chatRecord = await getChatFromDb({ chatId: input.chatId });

      if (chatRecord.length === 0) {
        return [];
      }

      // Get all messages for this chat
      const messages = await getChatMessagesFromDb({
        chatDbId: chatRecord[0].id,
      });

      // Convert database messages to UIMessage format
      return messages.map((msg) => ({
        id: msg.messageId,
        role: msg.role as "user" | "assistant" | "system",
        // TODO: fix the parts type
        // eslint-disable-next-line
        parts: msg.parts as any[],
      }));
    }),
  saveChat: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
        messages: z.array(UIMessageSchema),
      }),
    )
    .mutation(async ({ input: { userId, chatId, messages } }) => {
      if (messages.length > 0) {
        let chatDbId = "";
        const res = await getChatFromDb({ chatId });

        // if no existing chat found, create a new chat
        if (res.length === 0) {
          const result = await createChat({
            userId,
            chatId,
            title: "Untitled Chat",
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
    }),
  deleteChat: publicProcedure
    .input(z.object({ userId: z.string(), chatId: z.string() }))
    .mutation(async ({ input: { userId, chatId } }) => {
      const result = await deleteChatFromDb({
        userId,
        chatId,
      });

      return {
        id: result[0]?.id || null,
        status: "ok",
      };
    }),
  generateChatTitle: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        chatId: z.string(),
        messages: z.array(UIMessageSchema),
      }),
    )
    .mutation(async ({ input: { userId, chatId, messages } }) => {
      const result = await generateTextCall({
        system:
          "Create a brief, descriptive title (3-6 words, should be plain string) for sidebar display based on these initial messages from an AI chat:",
        prompt: JSON.stringify(messages),
      });

      await updateChatTitleInDb({
        userId,
        chatId,
        title: result.text,
      });

      return {
        status: "ok",
      };
    }),
});
