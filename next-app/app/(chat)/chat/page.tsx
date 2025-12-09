import { redirect } from "next/navigation";
import { generateId } from "ai";

export default function Page() {
  const id = generateId();
  redirect(`/chat/${id}`);
}
