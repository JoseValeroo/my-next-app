import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    // Extraer el handle desde la URL
    const urlParts = req.nextUrl.pathname.split("/");
    const handle = urlParts.at(-1);

    const res = await fetch(`/api/tweets/user/${handle}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Error al obtener tweets del usuario" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en GET /api/tweets/user/[handle]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
