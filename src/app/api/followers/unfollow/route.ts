import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = "/api/followers/unfollow";

export async function POST(req: Request) {
  try {
    const { follow_user_id } = await req.json();

    if (!follow_user_id || isNaN(follow_user_id)) {
      return NextResponse.json({ error: "ID de usuario no válido" }, { status: 400 });
    }


    const cookieStore = cookies(); // ✅ Esto está bien
    const token = (await cookieStore).get("token")?.value; // ✅ Esto también
    
    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ follow_user_id }), // ya es un número válido
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData?.error || "Error al dejar de seguir usuario" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("❌ Error en POST /api/followers/unfollow:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
