// "use client";

import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";
// export const { signIn, signUp, useSession, signOut } = createAuthClient({
export const authClientInstance = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
});

export const signOut = () => {
  authClientInstance
    .signOut()
    .then(() => redirect("/"))
    .catch((err) => console.error("ERROR: Error while signing out: ", err));
};
