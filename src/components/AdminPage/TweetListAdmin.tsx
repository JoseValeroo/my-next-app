'use client';

import { useEffect, useState } from 'react';
import Tweet from '@/components/tweet/tweet';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function TweetListAdmin() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchAllTweets = async () => {
    try {
      const res = await fetch('/api/admin/tweets', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al obtener tweets');
      const data = await res.json();
      setTweets(data);
    } catch (error) {
      toast.error('Error cargando tweets', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTweet = async (tweetId: number) => {
    try {
      const res = await fetch(`/api/admin/tweets/${tweetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar tweet');
      setTweets((prev) => prev.filter((t) => t.tweet_id !== tweetId));
      toast.success('Tweet eliminado');
    } catch (error) {
      toast.error('No se pudo eliminar el tweet', {
        description: error.message,
      });
    }
  };

  useEffect(() => {
    fetchAllTweets();
  }, []);

  const filteredTweets = tweets.filter((tweet) => {
    if (searchTerm.startsWith('@')) {
      const handle = searchTerm.slice(1).toLowerCase();
      return tweet.user_handle.toLowerCase().includes(handle);
    } else if (searchTerm.startsWith('#')) {
      const text = searchTerm.slice(1).toLowerCase();
      return tweet.tweet_text?.toLowerCase().includes(text);
    }
    return true;
  });

  if (loading) return <p className="text-zinc-500 dark:text-zinc-400">Cargando tweets...</p>;

  if (tweets.length === 0) return <p className="text-zinc-500 dark:text-zinc-400">No hay tweets disponibles.</p>;

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar: @usuario o #texto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-lg border border-zinc-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      {filteredTweets.map((tweet) => (
        <div key={tweet.tweet_id} className="relative">
          <Tweet
            tweet={tweet}
            onLike={() => {}}
            onComment={() => {}}
            onRetweetChange={() => {}}
          />

          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => deleteTweet(tweet.tweet_id)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md"
            >
              Eliminar
            </button>
            <button
              onClick={() => router.push(`/profile/${tweet.user_handle}`)}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm px-3 py-1 rounded-md"
            >
              Usuario ▾
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
