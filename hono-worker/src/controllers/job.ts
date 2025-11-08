import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

export const postJob = (c: Context) => {
  return c.json(
    {
      message: "HIT SUCCESS",
    },
    StatusCodes.OK,
  );
};
