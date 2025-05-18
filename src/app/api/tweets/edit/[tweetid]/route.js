import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(req, context) {
  try {
    const { params } = context; // ✅ Extraemos `params` correctamente con `await`

    const { tweetid } = await params; // ✅ Extraemos `tweetid` de `params`
    const tweetId = parseInt(tweetid, 10); // ✅ Convertimos a número

    console.log("📌 ID de tweet procesado en API para editar:", tweetId, typeof tweetId); // 🔍 Depuración

    if (isNaN(tweetId)) {
      console.error("❌ ID de tweet inválido en API para editar");
      return NextResponse.json({ error: "ID de tweet inválido" }, { status: 400 });
    }

    const { tweet_text } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    console.log(`🔄 Enviando PUT a backend con ID: ${tweetId} y texto: ${tweet_text}`);

    const response = await fetch(`/api/tweets/edit/${tweetId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ tweet_text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Error al editar el tweet" }, { status: response.status });
    }

    const updatedTweet = await response.json();
    console.log("✅ Respuesta del backend:", updatedTweet);
    return NextResponse.json(updatedTweet, { status: 200 });

  } catch (error) {
    console.error("❌ Error en la API de edición de tweets:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
