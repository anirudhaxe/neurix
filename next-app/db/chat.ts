import { and, eq, desc, sql } from "drizzle-orm";
import db from ".";
import { chat, message, type DBMessage } from "./schema";

async function createChat({
  chatId,
  userId,
  title,
}: {
  chatId: string;
  userId: string;
  title: string;
}) {
  return db.insert(chat).values({ userId, chatId, title }).returning();
}

const getChatFromDb = ({ chatId }: { chatId: string }) => {
  return db.select().from(chat).where(eq(chat.chatId, chatId)).limit(1);
};

const getChatMessagesFromDb = ({ chatDbId }: { chatDbId: string }) => {
  return db
    .select()
    .from(message)
    .where(eq(message.chatDbId, chatDbId))
    .orderBy(message.createdAt);
};

const getLastUserChatMessage = ({ chatDbId }: { chatDbId: string }) => {
  return db
    .select()
    .from(message)
    .where(and(eq(message.chatDbId, chatDbId), eq(message.role, "user")))
    .orderBy(desc(message.createdAt))
    .limit(1);
};

const getChatsAndPreviewMessageFromDb = ({ userId }: { userId: string }) => {
  // Subquery to get the latest user message ID for each chat
  const latestMessageSubquery = db
    .select({
      chatDbId: message.chatDbId,
      maxCreatedAt: sql<Date>`MAX(${message.createdAt})`.as("max_created_at"),
    })
    .from(message)
    .where(eq(message.role, "user"))
    .groupBy(message.chatDbId)
    .as("latest_msg");

  // Main query: join chats with their latest user message
  return db
    .select({
      id: chat.id,
      chatId: chat.chatId,
      title: chat.title,
      userId: chat.userId,
      visibility: chat.visibility,
      updatedAt: chat.updatedAt,
      createdAt: chat.createdAt,
      latestMessage: {
        id: message.id,
        messageId: message.messageId,
        role: message.role,
        parts: message.parts,
        attachments: message.attachments,
        createdAt: message.createdAt,
      },
    })
    .from(chat)
    .leftJoin(
      latestMessageSubquery,
      eq(chat.id, latestMessageSubquery.chatDbId),
    )
    .leftJoin(
      message,
      and(
        eq(message.chatDbId, chat.id),
        eq(message.role, "user"),
        eq(message.createdAt, latestMessageSubquery.maxCreatedAt),
      ),
    )
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.createdAt));
};

const insertMessages = ({
  values,
}: {
  values: Omit<DBMessage, "id" | "createdAt" | "updatedAt">[];
}) => {
  return db.insert(message).values(values);
};

export {
  getChatFromDb,
  getChatMessagesFromDb,
  getLastUserChatMessage,
  getChatsAndPreviewMessageFromDb,
  createChat,
  insertMessages,
};
