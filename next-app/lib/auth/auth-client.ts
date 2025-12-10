import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
});

export const signOut = async () => {
  try {
    await authClient.signOut();
    window.location.href = "/";
  } catch (err) {
    console.error("ERROR: Error while signing out: ", err);
  }
};
