const API_URL = "/api/community";

export async function fetchUserCommunities() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener comunidades del usuario");
  }

  return response.json();
}

export async function fetchUserProfile() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("api/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token en el encabezado
      },
      credentials: "include", // Incluir cookies en la solicitud
    });

    if (!response.ok) {
      throw new Error("Error al obtener el perfil del usuario");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error al obtener el perfil:", error);
    throw error;
  }
}

export const fetchExploreCommunities = async (category = "") => {
  let url = `${API_URL}/explore`;
  if (category) url += `?category=${category}`;
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw new Error("Error al obtener las comunidades");
  const data = await response.json();
  return data.communities;
};

export const joinCommunity = async (communityId) => {
  const response = await fetch(`${API_URL}/join`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ communityId }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al unirse a la comunidad");
  }
  return response.json();
};

export const leaveCommunity = async (communityId) => {
  const response = await fetch(`${API_URL}/leave`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ communityId }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al dejar la comunidad");
  }
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, { credentials: "include" });
  if (!response.ok) throw new Error("Error al obtener las categorías");
  const data = await response.json();
  return data.categories;
};

export const fetchPopularCommunities = async () => {
  const response = await fetch(`${API_URL}/popular`, { credentials: "include" });
  if (!response.ok) throw new Error("Error al obtener las comunidades populares");
  const data = await response.json();
  return data.communities;
};