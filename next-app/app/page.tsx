"use client";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth/auth-client";
import { redirect } from "next/navigation";

export default function Page() {
  const { isPending, data } = authClient.useSession();
  console.log(data);
  if (isPending) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col">
      <div>{`Welcome ${data?.session ? data.user.name : ""} to OpenContext`}</div>
      <Button className="w-30" onClick={() => redirect("/chat")}>
        Chat
      </Button>
      <Button className="w-30" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
