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
      // 2. LOG the Starling Status Code (e.g., 401, 403, 404)
      console.error(`Starling API request failed with status: ${res.status}`);

      // 3. LOG the Error Body (This is the most critical part!)
      const errorBody = await res.text();
      console.error("Starling API Error Response Body:", errorBody);

      // Return the appropriate error status (401 is common for auth failure)
      // We use the status *from Starling* if it's 4xx/5xx to be more descriptive.
      return new Response(
        JSON.stringify({
          error: `Starling API failed. Status: ${res.status}`,
          details: errorBody, // Include the Starling error details
        }),
        {
          status: res.status, // Use the actual status code from Starling
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
