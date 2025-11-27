import {
  integer,
  pgTable,
  // boolean,
  // foreignKey,
  json,
  // jsonb,
  // primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { user } from "./auth-schema";

// chat table
export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title").notNull(),
  userId: text("user_id").references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  // optionally implement tokenlens later
  // lastContext: jsonb("lastContext").$type<AppUsage | null>(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Chat = InferSelectModel<typeof chat>;

// message table
export const message = pgTable("message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;
