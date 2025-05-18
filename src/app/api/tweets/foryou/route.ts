import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const response = await fetch("/api/tweets/foryou", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener tweets para ti" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en /api/tweets/foryou:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
