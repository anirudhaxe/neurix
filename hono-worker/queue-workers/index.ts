import { Worker } from "bullmq";
import kvConnection from "../kv";

const jobQueueWorker = new Worker(
  "jobQueueWorker",
  async (job) => {
    console.log(job.data);
  },
  {
    connection: kvConnection,
  },
);

export { jobQueueWorker };
