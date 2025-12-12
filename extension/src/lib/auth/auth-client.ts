import { createAuthClient } from "better-auth/react";
import { SERVER_BASE_URL } from "..";

export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL,
});

export const { useSession, signIn, signOut } = authClient;
