import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    const { tweetid } = await params; // ✅ Esperamos `params`
    const tweetId = parseInt(tweetid, 10); // 🔥 Convertimos correctamente `tweetid` a número

    console.log("📌 ID de tweet recibido en API:", tweetId, typeof tweetId); // 🔍 Depuración

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (isNaN(tweetId)) { // Validación adicional para evitar errores
      console.error("❌ ID de tweet inválido en API de eliminación");
      return NextResponse.json({ error: "ID de tweet inválido" }, { status: 400 });
    }

    console.log("🔄 Enviando DELETE a backend con ID:", tweetId);

    const response = await fetch(`/api/tweets/delete/${tweetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error en el backend al eliminar tweet:", errorData);
      return NextResponse.json({ error: errorData.error || "Error al eliminar el tweet" }, { status: response.status });
    }

    console.log("✅ Tweet eliminado correctamente");
    return NextResponse.json({ message: "Tweet eliminado correctamente" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error en la API de eliminación de tweets:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
