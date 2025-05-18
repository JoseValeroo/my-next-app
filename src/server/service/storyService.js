const API_URL = "/api/stories";

export const uploadStory = async (file, description) => {
  const formData = new FormData();
  formData.append('media', file);
  formData.append('description', description);

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al subir el Story");
  }
  return response.json();
};

// export const fetchFollowingStories = async () => {
//   const response = await fetch(`${API_URL}/following`, {
//     credentials: "include",
//   });
//   if (!response.ok) throw new Error("Error al obtener Stories");
//   return response.json();
// };

export const fetchFollowingStories = async () => {
  try {
    const response = await fetch(`${API_URL}/following`, {
      credentials: "include",
    });
    
    if (response.status === 401) return { stories: [] };
    if (!response.ok) throw new Error("Error obteniendo stories");
    
    return await response.json();
  } catch (error) {
    console.error("Error en fetchFollowingStories:", error);
    return { stories: [] };
  }
};