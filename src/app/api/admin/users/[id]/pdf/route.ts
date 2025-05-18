// import { NextResponse } from "next/server";

// export async function GET(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const cookie = request.headers.get("cookie"); // 🔥 obtenemos la cookie del usuario autenticado

//     const res = await fetch(`http://localhost:3001/api/users/admin/${params.id}/pdf`, {
//       method: "GET",
//       headers: {
//         Cookie: cookie ?? "", // reenviamos la cookie
//       },
//     });

//     if (!res.ok) throw new Error("Error al obtener PDF");

//     const blob = await res.blob();
//     return new Response(blob, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="datos_usuario_${params.id}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error en GET /api/admin/users/[id]/pdf:", error);
//     return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");

    // Extraer ID desde la URL
    const urlParts = req.nextUrl.pathname.split("/");
    const id = urlParts.at(-2); // si la ruta es .../users/[id]/pdf

    const res = await fetch(`/api/users/admin/${id}/pdf`, {
      method: "GET",
      headers: {
        Cookie: cookie ?? "",
      },
    });

    if (!res.ok) throw new Error("Error al obtener PDF");

    const blob = await res.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="datos_usuario_${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("❌ Error en GET /api/admin/users/[id]/pdf:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
