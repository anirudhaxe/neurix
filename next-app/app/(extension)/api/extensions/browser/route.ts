import { jobQueue } from "@/queues";

export async function POST(request: Request) {
  const data = await request.json();

  await jobQueue.add("sampleJobName", { textData: data.text });

  const response = Response.json({
    received: "ok",
  });

  // Set CORS headers (origin, methods, headers)
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

// OPTIONS method for preflight requests
export async function OPTIONS() {
  const response = new Response(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
