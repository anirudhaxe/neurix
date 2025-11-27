"use server";

import { createChat } from "@/lib/chat-store";
import { redirect } from "next/navigation";

export const handleNewChat = async () => {
  const id = await createChat();
  redirect(`/chat/${id}`);
};
