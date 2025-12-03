import { eq } from "drizzle-orm";
import db from ".";
import { job, jobStatus } from "./schema";

type JobStatus = (typeof jobStatus.enumValues)[number];

export const updateJobStatus = ({
  jobId,
  status,
}: {
  jobId: string;
  status: JobStatus;
}) => {
  return db.update(job).set({ status }).where(eq(job.id, jobId));
};
