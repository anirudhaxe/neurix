import { TRPCError } from "@trpc/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error handler for native next js api routes
export function handleApiError(error: unknown, context: string): Response {
  console.error(`Error in ${context}:`, error);

  return Response.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : "Something went wrong on server",
    },
    { status: 500 },
  );
}

// Error handler for TRPC procedures
export function handleTRPCProcedureError(error: unknown, context: string) {
  console.error(`ERROR: Error in ${context}:`, error);

  // handles if a TRPC Error is manually thrown in the try block
  if (error instanceof TRPCError) throw error;

  // handles unhandled errors
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message:
      process.env.NODE_ENV === "development"
        ? error instanceof Error
          ? error.message
          : String(error)
        : "Something went wrong on server",
  });
}

// Format time ago
export function formatTimeAgo(date: Date) {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}
