"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/feed_c/tabs";
import Communities from "@/components/Communities/Communities";
import ChatIA from "@/components/IA/ChatIA";
import {
  fetchForYouTweets, 
  fetchFollowingTweets, 
  createTweet,
  likeTweet
} from "@/server/service/tweetService";
import Tweet from "@/components/tweet/tweet";
import { toast } from "sonner";
import FileDropZone from "./FileDropZone";

export default function Feed() {
  const [forYouTweets, setForYouTweets] = useState([]);
  const [followingTweets, setFollowingTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [activeTab, setActiveTab] = useState("for-you");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const MAX_FILE_SIZE_MB = 100;

  const handleRetweetChange = (tweetId, isRetweeted) => {
    setForYouTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet.tweet_id === tweetId
          ? { ...tweet, num_retweets: isRetweeted ? tweet.num_retweets + 1 : tweet.num_retweets - 1 }
          : tweet
      )
    );
    setFollowingTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet.tweet_id === tweetId
          ? { ...tweet, num_retweets: isRetweeted ? tweet.num_retweets + 1 : tweet.num_retweets - 1 }
          : tweet
      )
    );
    toast[isRetweeted ? "success" : "warning"](
      `Retweet ${isRetweeted ? "realizado" : "eliminado"}`, {
        description: isRetweeted
          ? "Has compartido este tweet"
          : "Has dejado de compartir este tweet",
      }
    );
  };

  const loadForYouTweets = async () => {
    try {
      const tweets = await fetchForYouTweets();
      setForYouTweets(tweets);
    } catch (error) {
      console.error(error);
    }
  };

  const loadFollowingTweets = async () => {
    try {
      const tweets = await fetchFollowingTweets();
      setFollowingTweets(tweets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadForYouTweets();
    loadFollowingTweets();
  }, []);

  useEffect(() => {
    if (activeTab === "for-you") {
      loadForYouTweets();
    } else if (activeTab === "following") {
      loadFollowingTweets();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.some(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024)) {
      toast.error("Error", {
        description: `Los archivos no pueden superar ${MAX_FILE_SIZE_MB}MB`,
      });
      return;
    }
    if (newTweet.trim() || selectedFiles.length > 0) {
      try {
        const formData = {
          text: newTweet,
          files: selectedFiles
        };
        toast.loading("Publicando tweet...", { id: "tweet-loading" });
        await createTweet(formData);
        setNewTweet("");
        setSelectedFiles([]);
        toast.success("¡Tweet publicado!", {
          description: "Tu mensaje se ha compartido correctamente",
          id: "tweet-loading"
        });
        loadForYouTweets();
        loadFollowingTweets();
      } catch (error) {
        toast.error("Error al publicar", {
          description: error.message || "No se pudo enviar el tweet",
          id: "tweet-loading"
        });
      }
    }
  };

  const toggleLike = async (tweet) => {
    try {
      const updatedTweet = { 
        ...tweet, 
        liked: !tweet.liked, 
        num_likes: tweet.liked ? tweet.num_likes - 1 : tweet.num_likes + 1 
      };

      setForYouTweets((prev) =>
        prev.map((t) => (t.tweet_id === tweet.tweet_id ? updatedTweet : t))
      );
      setFollowingTweets((prev) =>
        prev.map((t) => (t.tweet_id === tweet.tweet_id ? updatedTweet : t))
      );

      await likeTweet(tweet.tweet_id);
      toast[tweet.liked ? "warning" : "success"](
        `Like ${tweet.liked ? "eliminado" : "añadido"}`, {
          description: tweet.liked
            ? "Has quitado tu me gusta"
            : "¡Has dado me gusta a este tweet!",
        }
      );
    } catch (error) {
      toast.error("Error al actualizar like", {
        description: error.message || "No se pudo actualizar tu interacción"
      });
    }
  };

  const handleComment = (tweetId, commentText) => {
    console.log("Nuevo comentario en tweet", tweetId, commentText);
  };

  const TweetList = ({ tweets, onRetweetChange }) => (
    <div>
      <AnimatePresence initial={false}>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.tweet_id}
            tweet={tweet}
            onLike={toggleLike}
            onComment={handleComment}
            onRetweetChange={onRetweetChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex-1 max-w-full ml-8 mr-5 mx-auto overflow-hidden mt-4 p-4 bg-white dark:bg-gray-900 rounded-2xl ">
      <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="for-you" className="text-gray-900 dark:text-white data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-2xl">
            For You
          </TabsTrigger>
          <TabsTrigger value="following" className="text-gray-900 dark:text-white data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-2xl">
            Following
          </TabsTrigger>
          <TabsTrigger value="communities" className="text-gray-900 dark:text-white data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-2xl">
            Communities
          </TabsTrigger>
          <TabsTrigger value="ChatIA" className="text-gray-900 dark:text-white data-[state=active]:bg-gray-300 dark:data-[state=active]:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-2xl">
            ChatIA
          </TabsTrigger>
        </TabsList>
        <TabsContent value="for-you">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Input
                type="text"
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                placeholder="What's happening?"
                className="flex-1 bg-gray-100 text-black"
              />
              <Button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Publicar
              </Button>
              
            </div>
            <FileDropZone
                onFilesSelected={(files) => setSelectedFiles(files)}
              />
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-200 dark:bg-gray-100 px-2 py-1 rounded text-sm text-gray-500"
                >
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedFiles(prev =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    {/* Aquí puedes agregar un icono, por ejemplo, de react-icons */}
                    X
                  </button>
                </div>
              ))}
            </div><br />
          </form>
          <TweetList tweets={forYouTweets} onRetweetChange={handleRetweetChange} />
        </TabsContent>
        <TabsContent value="following">
          <TweetList tweets={followingTweets} onRetweetChange={handleRetweetChange} />
        </TabsContent>
        <TabsContent value="communities">
          <Communities />
        </TabsContent>
        <TabsContent value="ChatIA">
          <ChatIA />
        </TabsContent>
      </Tabs>
    </div>
  );
}
