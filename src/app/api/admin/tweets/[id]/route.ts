import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const backendURL = `http://${process.env.NEXT_PUBLIC_IP_BACKEND}:${process.env.NEXT_PUBLIC_PORT_BACKEND}`;

    const res = await fetch(`${backendURL}/tweets/admin/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookie || "",
      },
    });

    if (!res.ok) throw new Error("Error al eliminar tweet");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en DELETE /api/admin/tweets/[id]:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
