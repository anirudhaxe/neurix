import { toNextJsHandler } from "better-auth/next-js";
import auth from "@/lib/auth";

const handler = toNextJsHandler(auth);

const allowedOrigins = [process.env.BETTER_AUTH_URL];

function withCors(handlerFn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const origin = req.headers.get("origin");
    const response = await handlerFn(req);

    const isAllowed =
      origin &&
      (allowedOrigins.includes(origin) ||
        origin.startsWith("chrome-extension://"));

    if (isAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );

    return response;
  };
}

export const GET = withCors(handler.GET);
export const POST = withCors(handler.POST);
export const PUT = withCors(handler.PUT);
export const PATCH = withCors(handler.PATCH);
export const DELETE = withCors(handler.DELETE);

export const OPTIONS = async (req: Request) => {
  const origin = req.headers.get("origin");
  const response = new Response(null, { status: 204 });

  const isAllowed =
    origin &&
    (allowedOrigins.includes(origin) ||
      origin.startsWith("chrome-extension://"));

  if (isAllowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
};
