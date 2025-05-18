// import { NextResponse } from "next/server";

// export async function DELETE(request: Request, context: { params: { id: string } }) {
//   try {
//     const { params } = context;
//     const cookie = request.headers.get("cookie");

//     const res = await fetch(`http://localhost:3001/api/users/admin/${params.id}`, {
//       method: "DELETE",
//       headers: {
//         Cookie: cookie ?? "", // reenviamos la cookie
//       },
//     });

//     if (!res.ok) throw new Error("Error al eliminar usuario");

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("❌ Error en DELETE /api/admin/users/[id]:", error);
//     return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const cookie = req.headers.get("cookie");

    // Extraer el ID desde la URL
    const urlParts = req.nextUrl.pathname.split("/");
    const id = urlParts.at(-1); // si la ruta es /users/[id]

    const res = await fetch(`/api/users/admin/${id}`, {
      method: "DELETE",
      headers: {
        Cookie: cookie ?? "",
        //Cookie: cookie ?? "",
      },
    });

    if (!res.ok) throw new Error("Error al eliminar usuario");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en DELETE /api/admin/users/[id]:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
