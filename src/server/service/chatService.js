const API_AUTH_URL = "/api/auth";
const API_CHAT_URL = "https://magicloops.dev/api/loop/045b2856-a6ee-4796-ba19-3331109bfa4c/run";

// Obtener usuario autenticado
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

// Enviar mensaje al chatbot IA
export const sendMessageToAI = async (input) => {
    try {
      const response = await fetch(API_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
  
      if (!response.ok) throw new Error("Error en la respuesta de la IA");
  
      const data = await response.json();
      console.log("Respuesta de API_CHAT_URL:", data); // Agregamos este console.log
  
      return data;
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error);
      return { reply: "Lo siento, ha ocurrido un error." };
    }
  };
