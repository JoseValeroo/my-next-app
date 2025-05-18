import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = "/api/followers/following";

export async function GET() {
  try {
    const cookieStore = cookies();
    const tokenData = await cookieStore;
    const token = tokenData.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error al obtener seguidos" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error en GET /api/followers/following:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
