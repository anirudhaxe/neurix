import { loadChat } from "@/lib/chat-store";
import Chat from "@/components/Chat";
import { getChats } from "@/actions/chat";
import { trpc } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await loadChat(id);
  const mockThreads = await getChats({ userId: "TEMPID9090" });

  const greeting = await trpc.hello({ text: "server" });
  console.log(greeting);

  return <Chat id={id} initialMessages={messages} mockThreads={mockThreads} />;
}
