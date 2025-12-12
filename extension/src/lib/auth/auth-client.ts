import { createAuthClient } from "better-auth/react";
import { getServerBaseUrl } from "..";

export const authClient = createAuthClient({
  baseURL: getServerBaseUrl(),
});

export const { useSession, signIn, signOut } = authClient;
