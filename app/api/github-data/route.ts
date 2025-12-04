import { NextResponse } from "next/server";
import { fetchGitHubData } from "@/lib/github";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // We pass an empty string for the token, relying on fetchGitHubData
    // to pick up the GITHUB_PAT_KEY environment variable on the server.
    const data = await fetchGitHubData(username, "");

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
