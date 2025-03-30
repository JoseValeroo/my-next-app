"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import CardUsuario from "@/components/perfil_c/profile_card_usuario";
import CardTweets from "@/components/perfil_c/profile_card_tweets";
import PerfilNav from "@/components/perfil_c/perfil_nav";
import CardLogros from "@/components/perfil_c/profile_card_logros";
import CardIntereses from "@/components/perfil_c/profile_card_intereses"; 
import CardHabilidades from "@/components/perfil_c/profile_card_habilidades"; 
import UserTabs from "@/components/perfil_c/profile_tabs"; 

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [userDetails, setUserDetails] = useState({ achievements: [], interests: [], skills: [] });
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("/api/auth/me", { credentials: "include" });
        const authData = await authRes.json();
        if (!authData.authenticated) {
          setUser(null);
        } else {
          setUser(authData.user);

          // 🔹 Obtener tweets
          const tweetsRes = await fetch("/api/tweets", { credentials: "include" });
          const tweetsData = await tweetsRes.json();
          setTweets(tweetsData?.tweets ?? []);

          // 🔹 Obtener detalles del usuario
          const detailsRes = await fetch("/api/users/details", { credentials: "include" });

          if (!detailsRes.ok) {
            console.warn("⚠️ No se encontraron detalles del usuario (404).");
            setUserDetails({ achievements: [], interests: [], skills: [] });
          } else {
            const detailsData = await detailsRes.json();
            setUserDetails({
              achievements: detailsData.achievement ?? [],
              interests: detailsData.interest ?? [],
              skills: detailsData.skill ?? [],
            });
          }

          // 🔹 Obtener seguidores y seguidos
          const followersRes = await fetch("/api/followers", { credentials: "include" });
          const followingRes = await fetch("/api/followers/following", { credentials: "include" });

          if (followersRes.ok) {
            const followersData = await followersRes.json();
            setFollowers(followersData.followers ?? []);
          }

          if (followingRes.ok) {
            const followingData = await followingRes.json();
            setFollowing(followingData.seguidos ?? []);
          }
        }
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Añadir o eliminar  skills
  const handleAddSkill = async (newSkill: string) => {
    const res = await fetch("/api/users/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        category: "skill",
        detail_text: newSkill,
      }),
    });
  
    if (!res.ok) throw new Error("Error al guardar la habilidad");
  
    setUserDetails((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };
  
  const handleDeleteSkill = async (skillToDelete: string) => {
    const res = await fetch("/api/users/details", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        category: "skill",
        detail_text: skillToDelete,
      }),
    });
  
    if (!res.ok) throw new Error("Error al eliminar la habilidad");
  
    setUserDetails((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };
  
  // 🔹 Añadir o eliminar  interés
  const handleAddInterest = async (newInterest: string) => {
    try {
      const res = await fetch("/api/users/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          category: "interest",
          detail_text: newInterest,
        }),
      });
  
      if (!res.ok) throw new Error("No se pudo añadir el interés");
  
      // ✅ Actualizar UI sin recargar
      setUserDetails((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
    } catch (err) {
      console.error("❌ Error al guardar interés:", err);
    }
  };
  
  const handleDeleteInterest = async (interestToDelete: string) => {
    const res = await fetch("/api/users/details", {
      method: "DELETE", // 👈 Asumimos que haces DELETE también
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        category: "interest",
        detail_text: interestToDelete,
      }),
    });
  
    if (!res.ok) throw new Error("Error al eliminar el interés");
  
    // Quita el interés de la UI
    setUserDetails((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToDelete),
    }));
  };

 // 🔹 Añadir o eliminar  logros
 const handleAddAchievements = async (newAchievement: string) => {
  try {
    const res = await fetch("/api/users/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        category: "achievement",
        detail_text: newAchievement,
      }),
    });

    if (!res.ok) throw new Error("No se pudo añadir el interés");

    // ✅ Actualizar UI sin recargar
    setUserDetails((prev) => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement],
    }));
  } catch (err) {
    console.error("❌ Error al guardar interés:", err);
  }
};

const handleDeleteAchievement = async (achievementToDelete: string) => {
  const res = await fetch("/api/users/details", {
    method: "DELETE", // 👈 Asumimos que haces DELETE también
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      category: "achievement",
      detail_text: achievementToDelete,
    }),
  });

  if (!res.ok) throw new Error("Error al eliminar el interés");

  // Quita el interés de la UI
  setUserDetails((prev) => ({
    ...prev,
    achievements: prev.achievements.filter((i) => i !== achievementToDelete),
  }));
};
  
// 🔹 Eliminar tweet
const handleDeleteTweet = async (tweetId) => {
  const numericTweetId = parseInt(tweetId, 10);

  if (isNaN(numericTweetId)) {
      console.error("❌ Error al eliminar el tweet: ID de tweet inválido");
      return;
  }

  try {
      const res = await fetch(`/api/tweets/delete/${numericTweetId}`, {
          method: "DELETE",
          credentials: "include",
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error al eliminar el tweet");
      }

      // 🔥 Eliminar el tweet del estado
      setTweets((prevTweets) => prevTweets.filter((tweet) => tweet.tweet_id !== numericTweetId));
  } catch (error) {
      console.error("❌ Error al eliminar el tweet:", error);
  }
};

// 🔹 Editar tweet
const handleEditTweet = async (tweetId, newText) => {
  const numericTweetId = parseInt(tweetId, 10);

  if (isNaN(numericTweetId)) {
    console.error("❌ Error al editar el tweet: ID de tweet inválido");
    return;
  }

  try {
    const res = await fetch(`/api/tweets/edit/${numericTweetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tweet_text: newText }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al editar el tweet");
    }

    // ✅ Obtener el texto actualizado desde la respuesta del backend
    const updatedTweet = await res.json();

    // ✅ Asegurar que el tweet se actualiza en la UI inmediatamente
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet.tweet_id === numericTweetId
          ? { ...tweet, tweet_text: newText } // 🔥 Usamos `newText` directamente
          : tweet
      )
    );

    console.log("✅ Tweet actualizado en el estado:", updatedTweet);
  } catch (error) {
    console.error("❌ Error al editar el tweet:", error);
  }
};



  const renderTagsWithColors = (tags: string[]) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"];
    return tags.map((tag, index) => (
      <span key={index} className={`px-2 py-1 text-white rounded ${colors[index % colors.length]}`}>
        {tag}
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-200 dark:bg-gray-950 min-h-screen overflow-x-hidden"
    >
      <Toaster />
      <div className="mx-auto px-4 lg:px-8 flex justify-center mt-4">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-[250px] lg:flex-shrink-0 space-y-4 z-10 -mt-4">
            <PerfilNav  />
          </div>

          <div className="flex-1 space-y-4 w-full relative overflow-y-auto pb-24">
            <CardUsuario user={user} />
            
            {/* Cards de info adicional desplegables en pantallas medianas y pequeñas, debajo de cardUsuario*/}
            <div className="lg:hidden">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex py-1 px-2 bg-white dark:bg-gray-900 rounded-md shadow-sm mb-6"
                  >
                  <span className="mr-2 text-xs text-gray-700 dark:text-gray-300">{isExpanded ? 'Menos detalles de usuario' : 'Más detalles de usuario'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform text-black dark:text-white ${isExpanded ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
             
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2"
                  >
                  <CardLogros 
                    user={user}
                    achievements={userDetails.achievements}
                    renderTagsWithColors={renderTagsWithColors}
                    onAddAchievements={handleAddAchievements}
                    onDeleteAchievements={handleDeleteAchievement}/>
                  
                  <CardIntereses
                    user={user}
                    interests={userDetails.interests}
                    renderTagsWithColors={renderTagsWithColors}
                    onAddInterest={handleAddInterest}
                    onDeleteInterest={handleDeleteInterest}
                  />
                  <CardHabilidades user={user} skills={userDetails.skills} />
                </motion.div>
              </div>
            
              <CardTweets tweets={tweets} user={user} handleDeleteTweet={handleDeleteTweet} handleEditTweet={handleEditTweet} />
             
             {/* Cards info de usuario en pantallas grandes, ocultas en pequeñas*/}
            <div className="hidden lg:block space-y-4">
              <CardLogros
                user={user}
                achievements={userDetails.achievements}
                renderTagsWithColors={renderTagsWithColors}
                onAddAchievements={handleAddAchievements}
                onDeleteAchievements={handleDeleteAchievement}/>
                
              <CardIntereses
                user={user}
                interests={userDetails.interests}
                renderTagsWithColors={renderTagsWithColors}
                onAddInterest={handleAddInterest}
                onDeleteInterest={handleDeleteInterest}
              />
              <CardHabilidades
                user={user}
                skills={userDetails.skills}
                onAddSkill={handleAddSkill}
                onDeleteSkill={handleDeleteSkill}
              />

            </div>
              <UserTabs user={user} seguidores={followers}  following={following} recomendaciones={[]} followUser={() => {}}  unfollowUser={() => {}}/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
