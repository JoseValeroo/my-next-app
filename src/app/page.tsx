"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

import { ArticleCard } from "@/components/CardPrincipal/article-card";
import { CurrencyCard } from "@/components/CardsMonedas/currency-card";
import { SocialLinks } from "@/components/CardRedesSociales/social-links";
import { CardPensamientos } from "@/components/CardPensamientos/CardPensamientos";

import CardAutorizacion from "@/components/ui/cardAutorizacion";
import CardEventos from "@/components/CardEventosPorUsuario/CardEventos";
import CardCerrarSesion from "@/components/CardCerrarSesion/card-cerrar-sesion";
import CardinnfoSesion from "@/components/CardInfoSesion/card-infosesion";
import CombinedNavbar from "@/components/navbar/combinednavbar";
import { TweetCard } from "@/components/CardPrincipal/tweet-cards"
import { fetchTweets, fetchPopularTweets } from "@/server/service/tweetService";
import { fetchGeneralNews, fetchUserNews } from "@/server/service/newsService";
import Footer from "@/components/footer";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FullNewsList from "@/components/CardPrincipal/FullNewsList";

// Definir el tipo de los objetos en currencyPairs
interface CurrencyPair {
  base: string;
  quote: string;
  value: number;
  change: number;
}

const currencyPairs: CurrencyPair[] = [
  { base: "bitcoin", quote: "usd", value: 5.2, change: 0.9715 },
  { base: "ethereum", quote: "usd", value: 3.8, change: 1.0937 },
  { base: "eur", quote: "usd", value: 1.1, change: 0.8745 },
  { base: "usd", quote: "eur", value: 0.92, change: 1.0321 },
];

export default function HomePage() {
  // Usar el AuthContext para obtener el usuario
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = Boolean(user);

  // Estado para la vista expandida de un ArticleCard
  const [expandedArticle, setExpandedArticle] = useState<React.ReactNode | null>(null);
  // Estados para los tweets y la carga
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Estado para guardar las noticias
  const [news, setNews] = useState<any[]>([]);

  const [tweetMessage, setTweetMessage] = useState("");
  const [newsMessage, setNewsMessage] = useState("");

  // Cargar tweets según la autenticación
  useEffect(() => {
    async function loadTweets() {
      console.log("Loading tweets. isAuthenticated:", isAuthenticated);
      setTweets([]); // Reiniciamos tweets previos
      setLoading(true);
      try {
        let data;
        if (isAuthenticated) {
          console.log("Fetching user tweets");
          data = await fetchTweets();
          // Si no hay tweets propios, mostramos mensaje e invocamos tweets populares
          if (!data.tweets || data.tweets.length === 0) {
            setTweetMessage("No tienes tweets, mostrando tweets populares.");
            const popularData = await fetchPopularTweets();
            data.tweets = popularData.tweets;
          } else {
            setTweetMessage(""); // Limpiamos el mensaje si hay tweets propios
          }
        } else {
          console.log("Fetching popular tweets");
          data = await fetchPopularTweets();
          setTweetMessage(""); // Limpiamos el mensaje si no hay sesión
        }
        const sortedTweets = data.tweets.sort((a, b) => b.num_likes - a.num_likes);
        setTweets(sortedTweets);
      } catch (error) {
        console.error("Error al cargar los tweets:", error);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadTweets();
    }
  }, [isAuthenticated, authLoading]);  

  // Cargar noticias según la autenticación
  useEffect(() => {
    async function loadNews() {
      try {
        let data;
        if (isAuthenticated) {
          data = await fetchUserNews();
          // Si la bandera está activa, el usuario no pertenece a ninguna comunidad
          if (data.noCommunity) {
            setNewsMessage("No estás en ninguna comunidad, mostrando noticias generales.");
          } else {
            setNewsMessage("");
          }
          const formattedNews = data.news.map((article) => ({
            ...article,
            published_date: new Date(article.published_date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }));
          setNews(formattedNews);
        } else {
          data = await fetchGeneralNews();
          const filtered = data.news.filter(
            (article) => article.category === "Noticias Generales"
          );
          const formattedNews = filtered.map((article) => ({
            ...article,
            published_date: new Date(article.published_date).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }));
          setNews(formattedNews);
          setNewsMessage(""); // Limpiamos el mensaje si no hay sesión
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }
    if (!authLoading) {
      loadNews();
    }
  }, [isAuthenticated, authLoading]);
    
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-950">
      <CombinedNavbar />
      <AnimatePresence>
        {expandedArticle ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900"
          >
            <div className="container mx-auto p-4">
              <button
                onClick={() => setExpandedArticle(null)}
                className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              {expandedArticle}
            </div>
          </motion.div>
        ) : (
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4">
            {/* Diseño para ordenador y tablet */}
            <div className="hidden lg:grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {loading || tweets.length < 1 ? (
                <>
                <ArticleCard
                    key={`dynamic-article-${isAuthenticated}`}
                    large
                    title="Turn Your Devices From Distractions Into Time Savers Either"
                    excerpt="Every January, I usually purge old snail mail, clothes and unwanted knickknacks to start the year anew. This time, I focused on my digital spaces instead."
                    author="Yagami Souichirou"
                    date="28 enero 2024"
                    readTime="7 min read"
                    views={38}
                    image="https://img.freepik.com/vector-premium/fondo-gradiente-color-azul-sencillo-textura-suave_768131-988.jpg?semt=ais_hybrid"
                    onClick={setExpandedArticle}
                    isAuthenticated={isAuthenticated}
                  />

                <div className="space-y-6">
                  {/* Otros bloques estáticos o componentes adicionales */}
                  <ArticleCard
                    key={`static-article2-${isAuthenticated}`}
                    large
                    title="Draw Inspiration From Vibrancy"
                    excerpt="Finding beauty in the simplest forms of nature"
                    author="Lind Tailor"
                    date="30 enero 2024"
                    readTime="3 min read"
                    views={17}
                    image="https://e0.pxfuel.com/wallpapers/694/480/desktop-wallpaper-blue-color-gradient-1-data-id-navy-blue-dark-blue-gradient.jpg"
                    onClick={setExpandedArticle}
                    isAuthenticated={isAuthenticated}
                  />
                  <CardPensamientos key={`pensamientos-${isAuthenticated}`} isAuthenticated={isAuthenticated} />
                  <CardAutorizacion />
                </div>
              </>              
              ) : (
                // Bloque de noticias (en versión de escritorio)
                <>
                  <ArticleCard
                    key={`news-article-${isAuthenticated}`}
                    large
                    articles={news.slice(0, 3).map(article => ({
                      ...article,
                      image: article.image || '/default-news-image.jpg'
                    }))}
                    previewTitle={!isAuthenticated ? "Noticias Generales" : "Noticias para ti"}
                    message={newsMessage} // <-- Aquí se envía el mensaje
                    onClick={() => {
                      setExpandedArticle(
                        <FullNewsList news={news} isAuthenticated={isAuthenticated} />
                      );
                    }}
                    isAuthenticated={isAuthenticated}
                  />
                  <div className="space-y-6">
                    <ArticleCard
                      key={`tweet-article-${isAuthenticated}`}
                      large
                      tweet={tweets[0]}
                      previewTitle={
                        !isAuthenticated ? "Tweets más populares" : "Tus tweets más populares"
                      }
                      message={tweetMessage} // <-- Aquí se envía el mensaje para los tweets
                      onClick={() => {
                        // Lógica para expandir el bloque de tweets
                        const tweetData = tweets.map((tweet) => ({
                          name: new Date(tweet.created_at).toLocaleDateString(),
                          likes: tweet.num_likes || 0,
                        }));

                        const userInfluence = tweets.reduce<Record<string, number>>((acc, tweet) => {
                          acc[tweet.user_handle] = (acc[tweet.user_handle] || 0) + (tweet.num_likes || 0);
                          return acc;
                        }, {});

                        const sortedUsers = Object.entries(userInfluence)
                          .sort((a, b) => Number(b[1]) - Number(a[1]))
                          .slice(0, 3);

                        setExpandedArticle(
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {!isAuthenticated ? "Tweets más populares" : "Tus tweets más populares"}
                            </h2>
                            {tweets.slice(0, 3).map((tweet) => (
                              <TweetCard key={tweet.tweet_id} tweet={tweet} showStats={true} />
                            ))}
                            <h2 className="text-xl font-bold">Gráfico de evolución de likes</h2>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={tweetData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>
                            <h2 className="text-xl font-bold">Usuarios más influyentes</h2>
                            <ul>
                              {sortedUsers.map(([user, likes]) => (
                                <li key={user} className="text-sm text-gray-600 dark:text-gray-300">
                                  🏆 {user}: {Number(likes)} likes totales
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      }}
                    />
                    <CardPensamientos key={`pensamientos2-${isAuthenticated}`} isAuthenticated={isAuthenticated} />
                    <CardAutorizacion />
                  </div>
                </>

              )}
              <div className="space-y-6">
                <CardEventos />
              </div>
              <div className="relative grid grid-cols-2 gap-4">
                {currencyPairs.map((pair) => (
                  <CurrencyCard key={`${pair.base}-${pair.quote}`} pair={pair} />
                ))}
              </div>
              <div>
                <CardinnfoSesion />
                <br />
                <CardCerrarSesion />
                <br />
                <SocialLinks />
              </div>
            </div>
            {/* Diseño para móvil */}
            <div className="grid grid-cols-1 gap-6 lg:hidden">
              <div className="space-y-6">
                {loading || tweets.length < 2 ? (
                  <>
                    <ArticleCard
                      key={`mobile-static-article-${isAuthenticated}`}
                      large
                      title="Turn Your Devices From Distractions Into Time Savers Either"
                      excerpt="Every January, I usually purge old snail mail, clothes and unwanted knickknacks to start the year anew. This time, I focused on my digital spaces instead."
                      author="Yagami Souichirou"
                      date="January 30, 2024"
                      readTime="7 min read"
                      views={38}
                      image="https://img.freepik.com/vector-premium/fondo-gradiente-color-azul-sencillo-textura-suave_768131-988.jpg?semt=ais_hybrid"
                      onClick={setExpandedArticle}
                      isAuthenticated={isAuthenticated}
                    />
                    <ArticleCard
                      key={`mobile-static-article2-${isAuthenticated}`}
                      large
                      title="Draw Inspiration From Vibrancy"
                      excerpt="Finding beauty in the simplest formas de la naturaleza"
                      author="Lind Tailor"
                      date="January 28, 2024"
                      readTime="3 min read"
                      views={17}
                      image="https://e0.pxfuel.com/wallpapers/694/480/desktop-wallpaper-blue-color-gradient-1-data-id-navy-blue-dark-blue-gradient.jpg"
                      onClick={setExpandedArticle}
                      isAuthenticated={isAuthenticated}
                    />
                  </>
                ) : (
                  <>
                  <ArticleCard
                    key={`news-article-${isAuthenticated}`}
                    large
                    articles={news.slice(0, 3)} // Se muestran solo las 3 primeras
                    previewTitle={!isAuthenticated ? "Noticias Generales" : "Noticias para ti"}
                    onClick={() => {
                      setExpandedArticle(
                        <FullNewsList news={news} isAuthenticated={isAuthenticated} />
                      );
                    }}
                    isAuthenticated={isAuthenticated}
                  />
                  <div className="space-y-6">
                    <ArticleCard
                      key={`tweet-article-${isAuthenticated}`}
                      large
                      tweet={tweets[0]}
                      previewTitle={
                        !isAuthenticated ? "Tweets más populares" : "Tus tweets más populares"
                      }
                      onClick={() => {
                        // Definir tweetData para el gráfico de evolución de likes
                        const tweetData = tweets.map((tweet) => ({
                          name: new Date(tweet.created_at).toLocaleDateString(),
                          likes: tweet.num_likes || 0, // Asegurar que 'num_likes' es un número válido
                        }));

                        // Calcular el ranking de usuarios más influyentes
                        const userInfluence = tweets.reduce<Record<string, number>>((acc, tweet) => {
                          acc[tweet.user_handle] = (acc[tweet.user_handle] || 0) + (tweet.num_likes || 0);
                          return acc;
                        }, {});

                        const sortedUsers = Object.entries(userInfluence)
                          .sort((a, b) => Number(b[1]) - Number(a[1])) // Convertir a número explícitamente
                          .slice(0, 3);

                        setExpandedArticle(
                          <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {!isAuthenticated ? "Tweets más populares" : "Tus tweets más populares"}
                            </h2>

                            {/* Mostrar Top 3 tweets más populares */}
                            {tweets.slice(0, 3).map((tweet) => (
                              <TweetCard key={tweet.tweet_id} tweet={tweet} showStats={true} />
                            ))}

                            {/* Gráfico de evolución de likes */}
                            <h2 className="text-xl font-bold">Gráfico de evolución de likes</h2>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={tweetData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                              </LineChart>
                            </ResponsiveContainer>

                            {/* Ranking de usuarios más influyentes */}
                            <h2 className="text-xl font-bold">Usuarios más influyentes</h2>
                            <ul>
                              {sortedUsers.map(([user, likes]) => (
                                <li key={user} className="text-sm text-gray-600 dark:text-gray-300">
                                  🏆 {user}: {Number(likes)} likes totales
                                </li>
                              ))}
                            </ul>
                            
                          </div>
                        );
                      }}
                    />
                    <CardPensamientos key={`pensamientos2-${isAuthenticated}`} isAuthenticated={isAuthenticated} />
                    <CardAutorizacion />
                  </div>
                </>
                )}
                <CardPensamientos key={`mobile-pensamientos-${isAuthenticated}`} isAuthenticated={isAuthenticated} />
                <CardAutorizacion />
                <div className="relative grid grid-cols-2 gap-4 mt-6">
                  {currencyPairs.map((pair) => (
                    <CurrencyCard key={`${pair.base}-${pair.quote}`} pair={pair} />
                  ))}
                </div>
                <div className="flex justify-center items-center">
                  <CardinnfoSesion />
                  <CardCerrarSesion />
                </div>
                <div className="flex justify-center items-center">
                  <SocialLinks />
                </div>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}