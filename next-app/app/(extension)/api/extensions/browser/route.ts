import db from "@/db";
import { job } from "@/db/schema";
import { generateTextCall } from "@/lib/ai/llm";
import { jobQueue } from "@/queues";
import { handleApiError } from "@/lib/utils";
import auth from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user?.id)
      return Response.json({ error: "Authetication failed" }, { status: 401 });

    const userId = session.user.id;

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

    // Truncate text for title generation
    const truncatedText =
      data.text.length > 3000 ? data.text.substring(0, 3000) : data.text;

    let generatedTitle;
    await generateTextCall({
      system:
        "Create a brief, descriptive title (3-6 words, should be plain string) for sidebar display based on this raw text extracted from a web source:",
      prompt: truncatedText,
    })
      .then((result) => (generatedTitle = result.text))
      .catch((error) =>
        console.error(
          "Error while generating name(title) for text content:",
          error,
        ),
      );

    // Insert job record into database
    const result = await db
      .insert(job)
      .values({
        userId,
        name: generatedTitle || "PLACEHOLDER TITLE",
        status: "QUEUED",
        type: "TEXT",
      })
      .returning({ jobId: job.id });

    const jobId = result[0]?.jobId;

    if (!jobId)
      return Response.json({ error: "Failed to create job" }, { status: 500 });

    // Add job to queue
    await jobQueue.add(jobId, {
      userId,
      jobId,
      jobName: generatedTitle,
      textData: data.text,
    });

    const response = Response.json({
      success: true,
      jobId: result[0].jobId,
      message: "Job created successfully",
    });

    // Set CORS headers (origin, methods, headers)
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    return handleApiError(error, "POST /api/extensions/browser");
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
