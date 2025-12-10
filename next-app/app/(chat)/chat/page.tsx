import { redirect } from "next/navigation";
import { generateId } from "ai";
import auth from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  // access session in server component
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  redirect(`/chat/${generateId()}`);
}
