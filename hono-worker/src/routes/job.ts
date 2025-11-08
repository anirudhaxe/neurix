import { Hono } from "hono";
import { postJob } from "../controllers/job.js";

const jobRoute = new Hono();

jobRoute.post("/", postJob);

export default jobRoute;
