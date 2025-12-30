export async function GET() {
  const token = process.env.STARLING_ACCESS_TOKEN;
  const account = process.env.STARLING_ACCOUNT_UID;
  const category = process.env.STARLING_CATEGORY_UID;
  const changesSince = "2024-12-15T14:13:41.875Z";

  const res = await fetch(
    `https://api-sandbox.starlingbank.com/api/v2/feed/account/${account}/category/${category}?changesSince=${changesSince}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Starling Error Details:", errorData);

    return Response.json(
      { error: "Starling request failed", details: errorData },
      { status: res.status }
    );
  }

  const transactions = await res.json();
  return Response.json(transactions);
}
