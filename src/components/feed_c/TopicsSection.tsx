"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { getDynamicTopics } from "../../server/service/topicsService";

export default function TopicsSection() {
  const [topics, setTopics] = useState([]);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await getDynamicTopics();
        if (data) {
          setTopics(data);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTopic((prev) => (prev + 1) % topics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [topics]);

  if (loading) {
    return (
      <Card className="mb-6 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Popular Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Cargando topics...</p>
        </CardContent>
      </Card>
    );
  }

  if (topics.length === 0) {
    return (
      <Card className="mb-6 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Popular Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">No hay topics disponibles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Popular Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[4rem] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={topics[currentTopic].topic_id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
              className="text-center text-xl font-bold text-blue-500 dark:text-blue-300 my-4"
            >
              {topics[currentTopic].name}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
