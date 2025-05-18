// Ruta: /api/users/handle/[handle]
import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
  const { handle } = await context.params;

  try {
    const res = await fetch(`/api/users/handle/${handle}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Error al obtener datos del usuario" }, { status: res.status });
    }

    const userData = await res.json();
    return NextResponse.json(userData);
  } catch (error) {
    console.error("❌ Error en GET /api/users/handle/[handle]:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
