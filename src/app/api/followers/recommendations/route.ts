import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = await fetch("/api/followers/recommendations", {
    headers: {
      Cookie: req.headers.get("cookie") || "",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
