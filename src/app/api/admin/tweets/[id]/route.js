import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const cookie = request.headers.get("cookie"); // 🔥 Reenviamos también para DELETE
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const res = await fetch(`/api/tweets/admin/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookie,
      },
    });

    if (!res.ok) throw new Error("Error al eliminar tweet");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en DELETE /api/admin/tweets:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
