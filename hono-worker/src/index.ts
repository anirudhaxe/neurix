import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import initRoutes from "./routes/index.js";

/*
 * Queue workers
 * Imported here just for initialization
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jobQueueWorker } from "../queue-workers/index.js";

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = Number(process.env.PORT || 3001);

initRoutes(app);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
