import db from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const auth = betterAuth({
  // database
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // authentication methods
  emailAndPassword: {
    enabled: true,
  },
});

export default auth;
