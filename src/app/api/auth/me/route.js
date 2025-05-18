import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Obtener el perfil del usuario autenticado
export async function GET() {
  try {
    console.log("🔄 Iniciando autenticación en api/auth/me");

    const cookieStore = await cookies(); // ✅ OBLIGATORIO usar `await` en Next.js 15+
    const token = cookieStore.get("token")?.value;

    // 🔥 Eliminar cookies innecesarias
    cookieStore.delete("SLG_GWPT_Show_Hide_tmp");
    cookieStore.delete("SLG_wptGlobTipTmp");

    if (!token) {
      console.error("❌ No hay token en las cookies en api/auth/me.");
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    console.log("✅ Token encontrado en cookies en api/auth/me:", token);

    const response = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`❌ Error al obtener el perfil en api/auth/me: ${response.status}`);
      return NextResponse.json({ authenticated: false, user: null }, { status: response.status });
    }

    const user = await response.json();
    console.log("✅ Perfil del usuario obtenido en api/auth/me:", user);

    return NextResponse.json({ authenticated: true, user }, { status: 200 });

  } catch (error) {
    console.error("❌ Error inesperado en api/auth/me:", error);
    return NextResponse.json({ authenticated: false, user: null, error: "Error inesperado" }, { status: 500 });
  }
}

