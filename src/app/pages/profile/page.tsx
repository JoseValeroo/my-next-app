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
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authRes = await fetch("/api/auth/profile", { credentials: "include" });
        const authData = await authRes.json();
        if (!authData.authenticated) {
          setUser(null);
        } else {
          setUser(authData.user);

          const tweetsRes = await fetch("/api/tweets", { credentials: "include" });
          const tweetsData = await tweetsRes.json();
          setTweets(tweetsData?.tweets ?? []);

          const detailsRes = await fetch("/api/users/details", { credentials: "include" });
          if (!detailsRes.ok) {
            setUserDetails({ achievements: [], interests: [], skills: [] });
          } else {
            const detailsData = await detailsRes.json();
            setUserDetails({
              achievements: detailsData.achievement ?? [],
              interests: detailsData.interest ?? [],
              skills: detailsData.skill ?? [],
            });
          }

          const followersRes = await fetch("/api/followers", { credentials: "include" });
          if (followersRes.ok) {
            const followersData = await followersRes.json();
            setFollowers(followersData.followers ?? []);
          }

          const followingRes = await fetch("/api/followers/following", { credentials: "include" });
          if (followingRes.ok) {
            const followingData = await followingRes.json();
            setFollowing(followingData.seguidos ?? []);
          }

          const recsRes = await fetch("/api/followers/recommendations", { credentials: "include" });
          if (recsRes.ok) {
            const recsData = await recsRes.json();
            setRecommendations(recsData.recommendations ?? []);
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
  const followUser = async (userId: string) => {
    try {
      const res = await fetch("/api/followers/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ follow_user_id: userId }),
      });
      if (!res.ok) throw new Error("Error al seguir al usuario");
      const data = await res.json();
      setFollowing(data.followedUsers ?? []);
    } catch (err) {
      console.error("❌ Error al seguir:", err);
    }
  };

  const refetchFollowing = async () => {
    const res = await fetch("/api/followers/following", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setFollowing(data.seguidos ?? []);
    }
  };
  
  const unfollowUser = async (userId: string) => {
    try {
      const res = await fetch("/api/followers/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ follow_user_id: userId }), // 👈 sin parseInt
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al dejar de seguir al usuario");
      }
  
      const data = await res.json();
      return data; // devolvemos los datos por si quieres usarlos
    } catch (error) {
      console.error("❌ Error al dejar de seguir:", error);
    }
  };
  
  const handleAddSkill = async (newSkill) => {
    const res = await fetch("/api/users/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category: "skill", detail_text: newSkill }),
    });
    if (!res.ok) throw new Error("Error al guardar la habilidad");
    setUserDetails((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const handleDeleteSkill = async (skillToDelete) => {
    const res = await fetch("/api/users/details", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category: "skill", detail_text: skillToDelete }),
    });
    if (!res.ok) throw new Error("Error al eliminar la habilidad");
    setUserDetails((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill !== skillToDelete) }));
  };

  const handleAddInterest = async (newInterest) => {
    const res = await fetch("/api/users/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category: "interest", detail_text: newInterest }),
    });
    if (!res.ok) throw new Error("No se pudo añadir el interés");
    setUserDetails((prev) => ({ ...prev, interests: [...prev.interests, newInterest] }));
  };

  const handleDeleteInterest = async (interestToDelete) => {
    const res = await fetch("/api/users/details", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category: "interest", detail_text: interestToDelete }),
    });
    if (!res.ok) throw new Error("Error al eliminar el interés");
    setUserDetails((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interestToDelete) }));
  };

  const handleDeleteTweet = async (tweetId) => {
    const numericTweetId = parseInt(tweetId, 10);
    if (isNaN(numericTweetId)) return;
    const res = await fetch(`/api/tweets/delete/${numericTweetId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error al eliminar el tweet");
    setTweets((prev) => prev.filter((tweet) => tweet.tweet_id !== numericTweetId));
  };

  const handleEditTweet = async (tweetId, newText) => {
    const numericTweetId = parseInt(tweetId, 10);
    if (isNaN(numericTweetId)) return;
    const res = await fetch(`/api/tweets/edit/${numericTweetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tweet_text: newText }),
    });
    if (!res.ok) throw new Error("Error al editar el tweet");
    setTweets((prev) => prev.map((tweet) => tweet.tweet_id === numericTweetId ? { ...tweet, tweet_text: newText } : tweet));
  };

  const renderTagsWithColors = (tags) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-purple-500"];
    return tags.map((tag, index) => (
      <span key={index} className={`px-2 py-1 text-white rounded ${colors[index % colors.length]}`}>{tag}</span>
    ));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-200 dark:bg-gray-950 min-h-screen overflow-x-hidden">
      <Toaster />
      <div className="mx-auto px-4 lg:px-8 flex justify-center mt-4">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-[250px] lg:flex-shrink-0 space-y-4 z-10 -mt-4">
            <PerfilNav />
          </div>

          <div className="flex-1 space-y-4 w-full relative overflow-y-auto pb-24">
          <CardUsuario
            user={user}
            isOwnProfile={true} // <- estás en tu propio perfil
          />


            <div className="lg:hidden">
              <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex py-1 px-2 bg-white dark:bg-gray-900 rounded-md shadow-sm mb-6">
                <span className="mr-2 text-xs text-gray-700 dark:text-gray-300">{isExpanded ? 'Menos detalles de usuario' : 'Más detalles de usuario'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform text-black dark:text-white ${isExpanded ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-2">
                <CardLogros user={user} achievements={userDetails.achievements} editable={true} />
                <CardIntereses user={user} interests={userDetails.interests} renderTagsWithColors={renderTagsWithColors} onAddInterest={handleAddInterest} onDeleteInterest={handleDeleteInterest} editable={true} />
                <CardHabilidades user={user} skills={userDetails.skills} editable={true} />
              </motion.div>
            </div>

            <CardTweets 
            tweets={tweets} 
            user={user} 
            handleDeleteTweet={handleDeleteTweet} 
            handleEditTweet={handleEditTweet} 
            editable={true}
            />

            <div className="hidden lg:block space-y-4">
              <CardLogros user={user} achievements={userDetails.achievements} editable={true} />
              <CardIntereses user={user} interests={userDetails.interests} renderTagsWithColors={renderTagsWithColors} onAddInterest={handleAddInterest} onDeleteInterest={handleDeleteInterest} editable={true} />
              <CardHabilidades user={user} skills={userDetails.skills} onAddSkill={handleAddSkill} onDeleteSkill={handleDeleteSkill} editable={true} />
            </div>

            <UserTabs 
              user={user} 
              seguidores={followers} 
              following={following}
              setFollowing={setFollowing} 
              recomendaciones={recommendations} 
              followUser={followUser} 
              unfollowUser={unfollowUser}
              refetchFollowing={refetchFollowing}
              isOwnProfile={true}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
