const token = process.env.STARLING_ACCESS_TOKEN;
const account = process.env.STARLING_ACCOUNT_UID;

export async function GET() {
  const res = await fetch(
    `https://api-sandbox.starlingbank.com/api/v2/account/${account}/savings-goals`,
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

  const savings = await res.json();
  return Response.json(savings);
}

export async function PUT(request: Request) {
  const { name, currency, targetAmount } = await request.json();
  const res = await fetch(
    `https://api-sandbox.starlingbank.com/api/v2/account/${account}/savings-goals`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        currency: currency,
        target: {
          minorUnits: targetAmount,
          currency: currency,
        },
      }),
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
  const data = await res.json();
  return Response.json(data);
}
