import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // TODO: add this in enviroment variables
  baseURL: "http://localhost:3000",
});

export const { useSession, signIn, signOut } = authClient;
