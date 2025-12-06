"use client";
import { handleNewChat } from "@/actions/chat";

export default function Page() {
  return <button onClick={() => handleNewChat()}>Chat</button>;
}
