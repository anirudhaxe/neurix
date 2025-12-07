import Chat from "@/components/Chat";
import { trpc } from "@/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messages = await trpc.chat.loadChat({ chatId: id });
  const mockThreads = await trpc.chat.getChats({ userId: "TEMPID9090" });

  return <Chat id={id} initialMessages={messages} mockThreads={mockThreads} />;
}
