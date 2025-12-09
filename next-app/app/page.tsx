"use client";
import { handleNewChat } from "@/actions/chat";
import { signOut } from "@/lib/auth/auth-client";

export default function Page() {
  return (
    <div className="flex flex-col">
      <button onClick={() => handleNewChat()}>Chat</button>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
