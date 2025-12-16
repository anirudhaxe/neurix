import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { handleTRPCProcedureError } from "@/lib/utils";
import { jobStatus, jobType } from "@/db/schema";
import { deleteJobFromDb, getJobsFromDb } from "@/db/job";
import { TRPCError } from "@trpc/server";
import vectorStore from "@/lib/ai/vector-store";

export const jobRouteController = createTRPCRouter({
  getJobs: protectedProcedure
    .input(
      z.object({
        nameSearchQuery: z.string().optional(),
        type: z.enum(jobType.enumValues).optional(),
        status: z.enum(jobStatus.enumValues).optional(),
      }),
    )
    .query(async ({ ctx, input: { nameSearchQuery, type, status } }) => {
      try {
        return await getJobsFromDb({
          userId: ctx.userId,
          nameSearchQuery,
          type,
          status,
        });
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC QUERY /getJobs");
      }
    }),
  deleteJob: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input: { jobId } }) => {
      try {
        const result = await deleteJobFromDb({
          userId: ctx.userId,
          jobId,
        });

        // delete vectors from vector store
        if (vectorStore) {
          await vectorStore.delete({
            filter: {
              must: [
                { key: "metadata.userId", match: { value: ctx.userId } },
                { key: "metadata.jobId", match: { value: jobId } },
              ],
            },
          });
        }

        if (result[0]?.id) {
          return {
            id: result[0].id,
            status: "ok",
          };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "An error occured while deleting job",
          });
        }
      } catch (error) {
        handleTRPCProcedureError(error, "TRPC MUTATION /deleteJob");
      }
    }),
  // TODO: implement this later
  // retryJob: protectedProcedure.input(z.object()).mutation(() => {}),
});
