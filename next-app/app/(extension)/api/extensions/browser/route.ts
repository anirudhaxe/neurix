import db from "@/db";
import { job } from "@/db/schema";
import { jobQueue } from "@/queues";

export async function POST(request: Request) {
  try {
    // Validate request body
    const data = await request.json();

    if (!data.text || typeof data.text !== "string") {
      return Response.json(
        {
          error:
            "Invalid request: 'text' field is required and must be a string",
        },
        { status: 400 },
      );
    }

    // Add job to queue
    await jobQueue.add("sampleJobName", { textData: data.text });

    // Insert job record into database
    const result = await db
      .insert(job)
      .values({
        // pass userId dynamically once auth is implemented
        userId: "TEMPID9090",
        name: "Sample name",
        status: "QUEUED",
        type: "TEXT",
      })
      .returning({ id: job.id });

    if (result[0]?.id) {
      const response = Response.json({
        success: true,
        jobId: result[0].id,
        message: "Job created successfully",
      });

      // Set CORS headers (origin, methods, headers)
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");

      return response;
    } else {
      return Response.json({ error: "Failed to create job" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/extensions/browser:", error);

    // Generic error response
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
}

// OPTIONS method for preflight requests
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
