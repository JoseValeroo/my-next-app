const API_URL = "/api/auth";

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error al cerrar sesión");
  return response.text();
};

export const fetchAuthenticatedUser = async () => {
  try {
    const response = await fetch(`${API_AUTH_URL}/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("No autenticado");

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    return null;
  }
};