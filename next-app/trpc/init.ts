import { initTRPC } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

// Create tRPC context
export const createTRPCContext = cache(async () => {
  // Add your context here (session, database, etc.)
  return {
    userId: "user_123", // Example: replace with actual auth
  };
});

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Export reusable router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
