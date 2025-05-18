import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("/api/users/data", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del usuario");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
