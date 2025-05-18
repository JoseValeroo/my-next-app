import { NextResponse } from "next/server";

const API_URL = "/api/stories"; // URL del backend

// Obtener todas las stories (GET)
export async function GET(req) {
    try {
        const cookieStore = cookies(); // Obtiene las cookies correctamente en Next.js 15
        const token = await cookieStore.get("token")?.value || "";

        const res = await fetch(API_URL, {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            return NextResponse.json({ message: "No autenticado" }, { status: 401 });
        }

        if (!res.ok) {
            return NextResponse.json({ message: "Error al obtener stories" }, { status: res.status });
        }

        const stories = await res.json();
        return NextResponse.json(stories, { status: 200 });
    } catch (error) {
        console.error("❌ Error en GET /api/stories:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}



// Subir una nueva story (POST)
export async function POST(req) {
    try {
        const body = await req.json().catch(() => null); // Captura errores si el JSON es inválido
        if (!body) {
            return NextResponse.json({ message: "Cuerpo de la solicitud inválido" }, { status: 400 });
        }

        // Validar que la imagen es obligatoria
        if (!body.image_url) {
            return NextResponse.json({ message: "La imagen es obligatoria" }, { status: 400 });
        }

        const res = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 401) {
            return NextResponse.json({ message: "No autenticado" }, { status: 401 });
        }

        if (!res.ok) {
            console.error("❌ Error en POST /api/stories:", res.statusText);
            return NextResponse.json({ message: "Error al subir la story" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("❌ Error en POST /api/stories:", error);
        return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
    }
}
