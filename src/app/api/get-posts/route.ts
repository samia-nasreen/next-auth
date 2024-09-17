import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    const data = await response.json();

    const postsResponse = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );

    const postsData = await postsResponse.json();

    if (response.ok && !data.error && postsResponse.ok) {
      return NextResponse.json({
        message: "This is protected content",
        posts: postsData,
        data: data,
      });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
