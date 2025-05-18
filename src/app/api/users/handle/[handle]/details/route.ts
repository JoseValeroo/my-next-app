// Ruta: /api/users/handle/[handle]/details
import { NextResponse } from "next/server";

export async function GET(_: Request, context: any) {
  const { handle } = await context.params;

  try {
    const res = await fetch(`/api/users/handle/${handle}/details`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Error al obtener detalles del usuario" }, { status: res.status });
    }

    const details = await res.json();
    return NextResponse.json(details);
  } catch (error) {
    console.error("❌ Error en GET /api/users/handle/[handle]/details:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
