const API_URL = "/api/messages";

// Buscar usuario
export const fetchUserByQuery = async (query) => {
  const res = await fetch(`${API_URL}/search?query=${query}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Error al buscar usuario");
  return res.json();
};

// Agregar contacto
export const addContact = async (contactUserId) => {
  const res = await fetch(`${API_URL}/contacts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contactUserId })
  });
  if (!res.ok) throw new Error("Error al agregar contacto");
  return res.json();
};

// Obtener conversación
export const fetchConversation = async (contactId) => {
  const res = await fetch(`${API_URL}/conversation/${contactId}`, {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Error al cargar la conversación");
  return res.json();
};

// Enviar mensaje
export const sendMessage = async ({ receiverId, content }) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId, content })
  });
  if (!res.ok) throw new Error("Error al enviar mensaje");
  return res.json();
};

// Obtener usuarios con intereses similares
export const fetchSimilarInterests = async () => {
  const res = await fetch("api/messages/similar-interests", {
    method: "GET",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Error al obtener usuarios con intereses similares");
  return res.json();
};

export const fetchFollowing = async () => {
    const res = await fetch("api/messages/followed-users", {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener seguidos");
    return res.json();
  };
  
  export const fetchRecentChats = async () => {
    const res = await fetch("/api/messages/contacts", {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener chats recientes");
    return res.json();
  };

  export const fetchUnreadCount = async () => {
    const res = await fetch(`${API_URL}/unread`, {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener mensajes no leídos");
    return res.json();
  };
  
  export const markMessagesAsRead = async (contactId) => {
    const res = await fetch(`${API_URL}/conversation/${contactId}/read`, {
      method: "PUT",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al marcar como leído");
    return res.json();
  };

  export const fetchUnreadMessages = async () => {
    const res = await fetch(`${API_URL}/unread-messages`, {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Error al obtener mensajes no leídos");
    return res.json();
  };