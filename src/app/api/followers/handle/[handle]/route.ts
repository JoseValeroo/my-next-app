// Ruta: /api/followers/handle/[handle]
import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
  const { handle } = await context.params;

  try {
    const res = await fetch(`/api/followers/handle/${handle}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Error al obtener seguidores del usuario" }, { status: res.status });
    }

    const followers = await res.json();
    return NextResponse.json(followers);
  } catch (error) {
    console.error("❌ Error en GET /api/followers/handle/[handle]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
