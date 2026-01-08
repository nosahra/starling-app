import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
const token = process.env.STARLING_ACCESS_TOKEN;
const account = process.env.STARLING_ACCOUNT_UID;

export async function POST(request: Request) {
  try {
    const { savingsGoalUid, currency, targetAmount } = await request.json();
    const transferUid = uuidv4();

    if (!savingsGoalUid || !targetAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await fetch(
      `https://api-sandbox.starlingbank.com/api/v2/account/${account}/savings-goals/${savingsGoalUid}/add-money/${transferUid}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          amount: {
            minorUnits: targetAmount,
            currency: currency || "GBP",
          },
        }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Starling Error Details:", data);
      return NextResponse.json(
        { error: "Starling request failed", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
  }
}