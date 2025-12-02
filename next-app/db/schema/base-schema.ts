import {
  // integer,
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
  pgEnum,
} from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";
import { user } from "./auth-schema";

// add more types of job types later when working on multi modality, e.g. PDF, VIDEO etc
export const jobType = pgEnum("job_type", ["TEXT"]);
// these job status define the lifecycle of a job
export const jobStatus = pgEnum("job_status", [
  "QUEUED",
  "CANCELLED",
  "PROCESSING",
  "ERROR",
  "PROCESSED",
]);
// job table
export const job = pgTable("job", {
  // use this id as the master id of the job data in the vector store
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // add this id also in the vector store metadata
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),
  // name of the job (will be generated at the time of insertion)
  name: text("name").notNull(),
  status: jobStatus().notNull(),
  type: jobType().notNull(),
});

// chat table
export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: text("chat_id").notNull(),
  title: text("title").notNull(),
  // TODO: make user_id notNull()
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
  messageId: text("message_id").notNull(),
  chatDbId: uuid("chat_db_id")
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
