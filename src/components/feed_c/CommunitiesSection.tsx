"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPopularCommunities } from "@/server/service/communityService"; // Asegúrate de que la ruta sea la correcta

export default function CommunitiesSection() {
  const [communities, setCommunities] = useState([]);

  const getPopularCommunities = async () => {
    try {
      const data = await fetchPopularCommunities();
      setCommunities(data);
    } catch (error) {
      console.error("Error al obtener las comunidades populares:", error);
    }
  };

  useEffect(() => {
    // Cargar datos al montar el componente
    getPopularCommunities();
    const interval = setInterval(() => {
      getPopularCommunities();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Comunidades populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {communities.map((community) => (
            <li
              key={community.community_id}
              className="flex items-center justify-between text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-lg"
            >
              <span>{community.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {community.membersCount.toLocaleString()} miembros
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}