import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = "/api/followers/follow";

// 📌 POST /api/followers/follow → Seguir a un usuario
export async function POST(req) {
  const { follow_user_id } = await req.json();

  try {
    const cookieStore = cookies();
    const tokenData = await cookieStore;
    const token = tokenData.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ follow_user_id }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Error al seguir usuario" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error en POST /api/followers/follow:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
