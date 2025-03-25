"use client";

import { Edit, Trash, Check, X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

interface Tweet {
  tweet_id: string;
  avatar_url?: string;
  user_handle: string;
  tweet_text: string;
  media_urls?: string;
}

interface CardTweetsProps {
  tweets: Tweet[];
  user: {
    name: string;
    user_handle: string;
    avatarUrl?: string;
    coverUrl?: string;
    bio?: string;
    location?: string;
    birthday?: string;
    email?: string;
    followers: number;
    following: number;
  } | null;
  handleDeleteTweet: (tweetId: string) => void;
  handleEditTweet: (tweetId: string, text: string) => void;
}

const CardTweets: React.FC<CardTweetsProps> = ({ tweets, user, handleDeleteTweet, handleEditTweet }) => {
  const [editingTweetId, setEditingTweetId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  // Función para renderizar imágenes y videos
  const renderMedia = (mediaUrlsString: string | null) => {
    if (!mediaUrlsString) return null;
    
    let mediaUrls;
    try {
      mediaUrls = JSON.parse(mediaUrlsString);
    } catch (error) {
      console.error("Error al parsear media_urls:", error);
      return null;
    }

    return (
      <div className={`grid gap-2 mt-2 ${mediaUrls.length >= 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {mediaUrls.map((url: string, index: number) => (
          url.match(/\.(mp4|mov|avi)$/i) ? (
            <video 
              key={index} 
              controls 
              className="w-full h-auto max-h-96 object-contain"
              playsInline
              autoPlay
              muted
            >
              <source src={url} type="video/mp4" />
            </video>
          ) : (
            <img
              key={index}
              src={url}
              alt={`Media ${index}`}
              className="w-full h-auto max-h-96 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <Card className="text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-none shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Tweets</CardTitle>
        </CardHeader>
        <Separator className="bg-gray-300 dark:bg-gray-800" />
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-300">Inicia sesión para ver los tweets.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-none shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Tweets</CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 dark:bg-gray-800" />
      <CardContent className="pt-6">
        {!tweets || tweets.length === 0 ? (
          <p className="text-white dark:text-gray-300 text-center">No hay tweets disponibles.</p>
        ) : (
          <ul className="space-y-4">
            {tweets.map((tweet) => (
              <li key={tweet.tweet_id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Image 
                    src={tweet.avatar_url || "/placeholder-user.jpg"} 
                    alt="Avatar" 
                    width={48} 
                    height={48} 
                    className="rounded-full" 
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">{tweet.user_handle}</h4>
                    {editingTweetId === tweet.tweet_id ? (
                      <textarea
                        className="w-full p-2 text-gray-800 bg-gray-100 rounded-lg"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                    ) : (
                      <>
                        <p className="mt-1 text-gray-800 dark:text-gray-200">{tweet.tweet_text}</p>
                        {/* Renderizar medios si existen */}
                        {renderMedia(tweet.media_urls)}
                      </>
                    )}
                  </div>

                  <div className="flex gap-2 ml-auto items-center">
                    {editingTweetId === tweet.tweet_id ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={async () => {
                            await handleEditTweet(tweet.tweet_id, editedText);
                            setEditingTweetId(null);
                          }}
                          className="text-white bg-green-600 hover:bg-green-500 p-2 rounded-lg shadow-md"
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingTweetId(null)}
                          className="text-white bg-red-600 hover:bg-red-500 p-2 rounded-lg shadow-md"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingTweetId(tweet.tweet_id);
                            setEditedText(tweet.tweet_text);
                          }}
                          className="text-blue-500 hover:text-blue-400 p-2 rounded-lg shadow-md"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteTweet(tweet.tweet_id)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-lg shadow-md"
                        >
                          <Trash className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CardTweets;
