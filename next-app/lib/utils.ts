import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleApiError(error: unknown, context: string): Response {
  console.error(`Error in ${context}:`, error);

  return Response.json(
    {
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : "Something went wrong",
    },
    { status: 500 },
  );
}
