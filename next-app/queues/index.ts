import kvConnection from "@/kv";
import { Queue } from "bullmq";

const jobQueue = new Queue("jobQueue", { connection: kvConnection });

export { jobQueue };
