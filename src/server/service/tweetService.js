const API_URL = "/api/tweets";

export const fetchTweets = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error al obtener los tweets");
  return response.json();
};

export const fetchPopularTweets = async () => {
  const response = await fetch(`${API_URL}/popular`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error al obtener los tweets populares");
  return response.json();
};

// export const fetchForYouTweets = async () => {
//   const response = await fetch(`${API_URL}/foryou`, {
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Error fetching tweets by interest");
//   }
//   const data = await response.json();
//   return data.tweets.map(tweet => ({
//     ...tweet,
//     comments: tweet.comments || [],
//   }));
// };

export const fetchForYouTweets = async () => {
  const response = await fetch(`${API_URL}/foryou`, {
    credentials: "include",
  });

  // Si no hay sesión activa, devolvemos array vacío
  if (response.status === 401) {
    return [];
  }
  // Otros fallos sí los propagamos
  if (!response.ok) {
    throw new Error("Error fetching tweets by interest");
  }

  const data = await response.json();
  return data.tweets.map(tweet => ({
    ...tweet,
    comments: tweet.comments || [],
  }));
};



// export const fetchFollowingTweets = async () => {
//   const response = await fetch(`${API_URL}/following`, {
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Error fetching following tweets");
//   }
//   const data = await response.json();
//   return data.tweets;
// };

export const fetchFollowingTweets = async () => {
  try {
    const response = await fetch(`${API_URL}/following`, {
      credentials: "include",
    });

    if (response.status === 401) return [];
    if (!response.ok) throw new Error("Error obteniendo tweets");
    
    const data = await response.json();
    return data.tweets || [];
  } catch (error) {
    console.error("Error en fetchFollowingTweets:", error);
    return [];
  }
};

export const createTweet = async (tweetData) => {
  const formData = new FormData();
  //formData.append('text', tweetData.text); // Campo correcto
  formData.append('tweet_text', tweetData.text);

  if (tweetData.files?.length > 0) {
    tweetData.files.forEach(file => {
      formData.append('media', file); // Nombre "media" (debe coincidir con el servidor)
    });
  }

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    credentials: "include",
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error creando el tweet");
  }
  return response.json();
};

export const editTweet = async (tweet_id, tweet_text) => {
  const response = await fetch(`${API_URL}/edit/${tweet_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tweet_text }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al actualizar el tweet");
  }
  return response.json();
};

export const deleteTweet = async (tweet_id) => {
  const response = await fetch(`${API_URL}/delete/${tweet_id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al eliminar el tweet");
  }
  return response.json();
};

export const likeTweet = async (tweet_id) => {
  const response = await fetch(`${API_URL}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ tweet_id }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al dar like");
  }
  return response.json();
};

export const commentTweet = async (tweetId, commentText) => {
  const response = await fetch(`${API_URL}/${tweetId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment_text: commentText }),
  });
  if (!response.ok) throw new Error("Error al comentar");
  return await response.json();
};

export const fetchCommentsByTweet = async (tweetId) => {
  const response = await fetch(`${API_URL}/${tweetId}/comments`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error al obtener comentarios");
  return await response.json();
};

export const toggleRetweet = async (tweet_id) => {
  const response = await fetch(`${API_URL}/retweet`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tweet_id }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error al hacer retweet");
  }
  return response.json();
};
