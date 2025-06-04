import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const backendURL = `http://${process.env.NEXT_PUBLIC_IP_BACKEND}:${process.env.NEXT_PUBLIC_PORT_BACKEND}`;
    console.log("🌍 Llamando a backend en:", `${backendURL}/tweets/admin/all`);
    console.log("🍪 Cookie enviada:", cookie);

    const res = await fetch(`${backendURL}/tweets/admin/all`, {
      method: "GET",
      headers: {
        Cookie: cookie || "",
      },
    });

    console.log("📨 Status del backend:", res.status);
    const data = await res.json();
    console.log("✅ Respuesta JSON:", data);

    if (!res.ok) throw new Error("Error al obtener tweets");
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en GET /api/admin/tweets:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
