import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");

    const res = await fetch("/api/admin/users", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    if (!res.ok) throw new Error("Error al obtener usuarios");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en GET /api/admin/users:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
