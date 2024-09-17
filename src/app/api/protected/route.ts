import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json({
      message: "This is protected content",
      user: session.user,
    });
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
