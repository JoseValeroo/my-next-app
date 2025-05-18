// Ruta: /api/followers/handle/[handle]/following
import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
  const { handle } = await context.params;

  try {
    const res = await fetch(`/api/followers/handle/${handle}/following`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Error al obtener seguidos del usuario" }, { status: res.status });
    }

    const following = await res.json();
    return NextResponse.json(following);
  } catch (error) {
    console.error("❌ Error en GET /api/followers/handle/[handle]/following:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
