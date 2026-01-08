export async function GET() {
  const token = process.env.STARLING_ACCESS_TOKEN;
  const account = process.env.STARLING_ACCOUNT_UID;

  const res = await fetch(
    `https://api-sandbox.starlingbank.com/api/v2/accounts/${account}/balance`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    return new Response("Starling req failed", { status: 500 });
  }

  const balance = await res.json();
  return Response.json(balance);
}
