import { Worker } from "bullmq";
import kvConnection from "../kv";

const jobQueueWorker = new Worker("jobQueueWorker", async (job) => {}, {
  connection: kvConnection,
});

export { jobQueueWorker };
