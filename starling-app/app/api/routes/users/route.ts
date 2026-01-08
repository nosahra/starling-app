export async function GET() {
  const token = process.env.STARLING_ACCESS_TOKEN;

  if (!token) {
    console.error("STARLING ACCESS TOKEN not defined");
    return new Response(
      JSON.stringify({ error: "Server configuration missing API token." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const res = await fetch(
      "https://api-sandbox.starlingbank.com/api/v2/accounts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      console.error(`Starling API request failed with status: ${res.status}`);

      const errorBody = await res.text();
      console.error("Starling API Error Response Body:", errorBody);

      return new Response(
        JSON.stringify({
          error: `Starling API failed. Status: ${res.status}`,
          details: errorBody, 
        }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success path
    const users = await res.json();
    return Response.json(users);
  } catch (error) {
    console.error("An unexpected error occured suring fetch:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error during Starling fetch process.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
