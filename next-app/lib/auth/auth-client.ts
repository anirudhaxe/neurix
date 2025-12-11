import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: process.env.NODE_ENV === "production"
  //   ? process.env.NEXT_PUBLIC_APP_URL
  //   : "http://localhost:3000",
});

export const { useSession } = authClient;

export const signOut = async () => {
  try {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          console.error("ERROR: Error while signing out: ", ctx.error);
        },
      },
    });
  } catch (err) {
    console.error("ERROR: Error while signing out: ", err);
  }
};
