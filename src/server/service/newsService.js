const API_URL = "/api/news";

/**
 * Obtiene noticias generales (para usuarios no autenticados)
 */
export async function fetchGeneralNews() {
    const response = await fetch(`${API_URL}/general`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Error fetching general news");
    return response.json();
}

/**
 * Obtiene noticias personalizadas (para usuarios autenticados)
 */
export async function fetchUserNews() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error fetching user news");
    return response.json();
}

export async function fetchNewsByCategory(category) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/category/${encodeURIComponent(category)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        credentials: "include",
    });
    if (!response.ok) throw new Error("Error fetching category news");
    return response.json();
}