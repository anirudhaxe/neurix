import type { Hono } from "hono";
import jobRoute from "./job.js";

const initRoutes = (app: Hono) => {
  const api = app.basePath("/api/v1");

  api.route("/job", jobRoute);
};

export default initRoutes;
