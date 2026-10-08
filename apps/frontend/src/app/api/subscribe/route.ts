const apiBase = process.env.API_BASE_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 1024) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const response = await fetch(`${apiBase}/subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      return Response.json({ message: "You're on the list!" }, { headers: { "Cache-Control": "no-store" } });
    }

    if (response.status === 400) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
  } catch { /* Return the same friendly error for network and backend failures. */ }

  return Response.json({ error: "Subscriptions are unavailable right now. Please try again soon." }, { status: 503 });
}
