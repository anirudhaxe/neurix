import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";

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
import { formatTimeAgo, handleTRPCProcedureError } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

// Zod schema for UIMessage
const UIMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  parts: z.array(z.any()), // UIMessagePart can be complex, using z.any() for flexibility
});

export const chatRouteController = createTRPCRouter({
  getChats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await getChatsAndPreviewMessageFromDb({
        userId: ctx.userId,
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
          timestamp: formatTimeAgo(chat.updatedAt),
        };
      });
    } catch (error) {
      handleTRPCProcedureError(error, "TRPC QUERY /getChats");
    }
  }),
  loadChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input }) => {
      try {
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
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC QUERY /loadChat");
      }
    }),
  saveChat: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        messages: z.array(UIMessageSchema),
      }),
    )
    .mutation(async ({ input: { chatId, messages }, ctx }) => {
      try {
        if (messages.length > 0) {
          let chatDbId = "";
          const res = await getChatFromDb({ chatId });

          // if no existing chat found, create a new chat
          if (res.length === 0) {
            const result = await createChat({
              userId: ctx.userId,
              chatId,
              // title: generatedTitle?.text || "Untitled Chat",
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
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC MUTATION /saveChat");
      }
    }),
  deleteChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input: { chatId }, ctx }) => {
      try {
        const result = await deleteChatFromDb({
          userId: ctx.userId,
          chatId,
        });

        if (result[0]?.id) {
          return {
            id: result[0].id,
          };
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "An error occurred while deleting chat",
          });
        }
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC MUTATION /deleteChat");
      }
    }),
  generateChatTitle: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        messages: z.array(UIMessageSchema),
      }),
    )
    .mutation(async ({ input: { chatId, messages }, ctx }) => {
      try {
        const result = await generateTextCall({
          system:
            "Create a brief, descriptive title heading (3-6 words, should be plain string with no markdown formatting) for sidebar display based on these initial first messages from an AI chat:",
          prompt: JSON.stringify(messages),
        });

        await updateChatTitleInDb({
          userId: ctx.userId,
          chatId,
          title: result.text,
        });

        return {
          status: "ok",
        };
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC MUTATION /generateChatTitle");
      }
    }),
});
