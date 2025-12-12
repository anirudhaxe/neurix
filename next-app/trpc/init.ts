import auth from "@/lib/auth";
import { headers } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

// Create tRPC context
export const createTRPCContext = cache(async () => {
  // Get this from cookies/headers/session
  // Example: const session = await getServerSession();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    isAuthenticated: !!session?.session,
    userId: session?.user.id || null, // null if not authenticated
  };
});

// Initialize tRPC
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

// Export reusable router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Public procedure - accessible by anyone
export const publicProcedure = t.procedure;

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Dummy check: verify user is authenticated
  if (!ctx.userId || !ctx.isAuthenticated) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  // Pass userId to the next procedure
  return next({
    ctx: {
      userId: ctx.userId,
      isAuthenticated: ctx.isAuthenticated,
    },
  });
});
