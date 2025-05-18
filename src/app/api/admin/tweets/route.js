import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const cookie = request.headers.get("cookie"); // 🔥 Reenviamos la cookie del usuario

    const res = await fetch("/api/tweets/admin/all", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    if (!res.ok) throw new Error("Error al obtener tweets");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en GET /api/admin/tweets:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}