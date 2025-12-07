"use server";
import { generateId } from "ai";
import { redirect } from "next/navigation";

export const handleNewChat = async () => {
  // generate a new chat id
  const id = generateId();
  redirect(`/chat/${id}`);
};
