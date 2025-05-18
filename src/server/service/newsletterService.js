const API_URL = "/api/newsletter";

export const subscribeNewsletter = async (communityId) => {

  const response = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ community_id: communityId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al suscribirse");
  }

  return response.json();
};

export const unsubscribeNewsletter = async (communityId) => {
  console.log("🔥 Ejecutando UNSUBSCRIBE para comunidad:", communityId);
  const response = await fetch(`${API_URL}/unsubscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ Las cookies se envían automáticamente
    body: JSON.stringify({ community_id: communityId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al desuscribirse");
  }

  return response.json();
};

export const fetchNewsletterSubscriptions = async () => {
  
  const response = await fetch(`${API_URL}/subscriptions`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error obteniendo suscripciones");
  }

  return response.json();
};