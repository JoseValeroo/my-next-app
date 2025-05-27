"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Share, Repeat1, FileText } from "lucide-react"; // Importamos FileText en lugar de FilePdf
import CommentInput from "@/components/CommentInput/CommentInput";
import { commentTweet, fetchCommentsByTweet } from "@/server/service/tweetService";
import { toggleRetweet } from "@/server/service/tweetService";
import VideoPlayer from "@/components/feed_c/VideoPlayer";
import Link from "next/link";
import Image from "next/image";

const Tweet = ({ tweet, onLike, onComment, onRetweetChange }) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comments, setComments] = useState(tweet.comments || []);
    const [numComments, setNumComments] = useState(tweet.num_comments || 0);
    const [tweetState, setTweetState] = useState(tweet);
    const [isRetweetedLocal, setIsRetweetedLocal] = useState(tweet.retweeted || false);
    const API_BASE =`http://${process.env.NEXT_PUBLIC_IP_BACKEND}:${process.env.NEXT_PUBLIC_PORT_BACKEND}`;

    const getFileNameFromUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const renderMedia = () => {
        if (!tweet.media_urls) return null;
        let mediaUrls = JSON.parse(tweet.media_urls);
        mediaUrls = mediaUrls.map(url =>
            url.startsWith("http") ? url : `${API_BASE}${url}`
        );

        return (
            <div className={`grid gap-2 mt-4 grid-cols-${mediaUrls.length >= 2 ? "2" : "1"}`}>
                {mediaUrls.map((url, index) => {
                    if (url.match(/\.pdf$/i)) {
                        const fileName = getFileNameFromUrl(url);
                        return (
                            <div key={index} className="relative w-full overflow-hidden rounded-lg">
                                <div className="flex items-center justify-between p-4 rounded-t-lg">
                                    <div className="flex items-center">
                                        <FileText className="mr-2 h-6 w-6 text-red-500" /> {/* Usamos FileText aquí */}
                                        <span className="text-sm font-medium">{fileName}</span>
                                    </div>
                                    <a
                                        href={url}
                                        download={fileName}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                    >
                                        Descargar PDF
                                    </a>
                                </div>
                            </div>
                        );
                    }
                    if (url.match(/\.(mp4|mov|avi)$/i)) {
                        return (
                            <div key={index} className="relative w-full overflow-hidden rounded-lg">
                                <VideoPlayer src={url} /><br />
                            </div>
                        );
                    }
                    return (
                        <div key={index} className="relative w-full overflow-hidden rounded-lg">
                            <Image
                                key={index}
                                src={url}
                                alt={`Media ${index}`}
                                width={800}
                                height={600}
                                className="w-full h-auto max-h-96 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                                />
                            <br></br>
                        </div>
                    );
                })}
            </div>
        );
    };

    useEffect(() => {
        setTweetState(tweet);
        setIsRetweetedLocal(tweet.retweeted || false);
    }, [tweet]);

    useEffect(() => {
        if (showCommentInput && comments.length === 0) {
            fetchCommentsByTweet(tweet.tweet_id)
                .then((data) => {
                    setComments(data.comments);
                    setNumComments(data.comments.length);
                })
                .catch((error) => console.error("Error al obtener comentarios:", error));
        }
    }, [showCommentInput, tweet.tweet_id, comments.length]);

    const handleComment = async (tweetId, commentText) => {
        try {
            const response = await commentTweet(tweetId, commentText);
            const newComment = response.comment;
            setComments([...comments, newComment]);
            setNumComments((prev) => prev + 1);
            onComment(tweetId, numComments + 1);
        } catch (error) {
            console.error("Error al crear comentario:", error);
        }
    };

    const handleRetweet = async () => {
        try {
            const res = await toggleRetweet(tweetState.tweet_id);
            if (res.success) {
                const newRetweetState = {
                    ...tweetState,
                    num_retweets: isRetweetedLocal
                        ? tweetState.num_retweets - 1
                        : tweetState.num_retweets + 1,
                    retweeted: !isRetweetedLocal,
                };
                setTweetState(newRetweetState);
                setIsRetweetedLocal(!isRetweetedLocal); // Actualiza el estado local
                onRetweetChange(tweetState.tweet_id, !isRetweetedLocal); // Notifica al padre
            }
        } catch (error) {
            console.error("Error al hacer retweet:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-4"
        >
            {tweet.retweeter && (
                <p className="text-sm text-gray-500">
                    Retweteado por @{tweet.retweeter}
                </p>
            )} <br />
            <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={tweet.avatar_url} alt={tweet.user_handle} />
                    <AvatarFallback>{tweet.user_handle ? tweet.user_handle[0] : "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <Link href={`/pages/profile/${tweet.user_handle}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">
                        @{tweet.user_handle}
                    </h3>
                    </Link>
                    {tweet.community_id && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Tweet de comunidad
                    </span>
                    )}
                </div>
            </div>


            <p className="text-gray-700 dark:text-gray-300 mb-4 break-words whitespace-pre-wrap">
                {tweet.tweet_text || tweet.comment_text}
            </p>
            {renderMedia()}
            <div className="flex items-center justify-start space-x-4 text-gray-500 dark:text-gray-400">
                <Button variant="ghost" size="sm" onPress={() => onLike(tweet)}>
                    <Heart className="mr-2 h-4 w-4" color={tweet.liked ? "red" : "currentColor"} fill={tweet.liked ? "red" : "none"} />
                    {tweet.num_likes || 0}
                </Button>
                <Button variant="ghost" size="sm" onPress={() => setShowCommentInput(!showCommentInput)}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {numComments}
                </Button>
                <Button variant="ghost" size="sm" onPress={handleRetweet}>
                    {isRetweetedLocal ? (
                        <Repeat1 className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                        <Repeat2 className="mr-2 h-4 w-4" />
                    )}
                    {tweetState.num_retweets || 0}
                </Button>
                <Button variant="ghost" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                </Button>
            </div>
            {showCommentInput && <CommentInput tweetId={tweet.tweet_id} onCommentSubmit={handleComment} />}
            {comments.length > 0 && (
                <div className="mt-4 border-l-2 border-gray-300 pl-4">
                    {comments.map((comment) => (
                        <Tweet key={comment.comment_id || comment.tweet_id} tweet={comment} onLike={onLike} onComment={onComment} onRetweetChange={onRetweetChange} />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Tweet;