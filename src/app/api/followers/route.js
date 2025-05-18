import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = "/api/followers"; // 🔥 Asegurando la ruta correcta

export async function GET() {
  try {
    const cookieStore = cookies();
    const tokenData = await cookieStore;
    const token = tokenData.get("token")?.value;

    if (!token) {
      console.warn("⚠️ No hay token, usuario no autenticado.");
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    console.log("🔑 Token encontrado, enviando petición a:", API_BASE_URL);

    const response = await fetch(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`❌ Error en la API followers: ${response.status}`);
      return NextResponse.json({ error: "Error al obtener seguidores" }, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ Seguidores obtenidos:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Error en GET /api/followers:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
