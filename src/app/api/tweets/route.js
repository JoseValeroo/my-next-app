import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = "/api/tweets";

// 📌 GET /api/tweets → Obtener tweets del usuario autenticado
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado en api tweet" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error obteniendo tweets en api tweet" }, { status: response.status });
    }

    const tweets = await response.json();
    return NextResponse.json(tweets, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo tweets en api tweet:", error);
    return NextResponse.json({ error: "Error en el servidor en api tweet" }, { status: 500 });
  }
}

