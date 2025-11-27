"use client";
import { handleNewChat } from "@/actions/chat";

export default function Page() {
  return <button onClick={async () => await handleNewChat()}>Chat</button>;
}
