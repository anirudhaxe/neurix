import Chat from "@/components/Chat";
import { trpc } from "@/trpc/server";
import auth from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // access session in server component
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  if (!userId) {
    redirect("/sign-in");
  }
  const { id } = await params;

  const initialMessages = await trpc.chat.loadChat({ chatId: id });

  return <Chat id={id} userId={userId} initialMessages={initialMessages} />;
}

// Sample loading.ts
// export default function Loading() {
//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//         <p className="text-muted-foreground">Just a moment...</p>
//       </div>
//     </div>
//   );
// }
