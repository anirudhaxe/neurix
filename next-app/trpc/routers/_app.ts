import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  // Example query
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `Hello ${opts.input.text}!`,
      };
    }),

  // Example mutation
  createPost: baseProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async (opts) => {
      // Your database logic here
      return {
        id: "1",
        ...opts.input,
      };
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
