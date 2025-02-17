const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return new Response(JSON.stringify(error), { status: response.status });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration successful",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Registration failed",
      }),
      { status: 500 }
    );
  }
}
