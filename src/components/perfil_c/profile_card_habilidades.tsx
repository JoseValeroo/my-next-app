"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/app/context/AuthContext";

// Definimos la estructura de los props
interface CardHabilidadesProps {
  skills?: string[]; // 🔥 Ahora es opcional
}

const CardHabilidades: React.FC<CardHabilidadesProps> = ({ skills = [] }) => {
  const { user } = useAuth(); // 🔥 Obtenemos el estado de autenticación

  if (!user) {
    return (
      <Card className="mb-8 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-none shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Habilidades</CardTitle>
        </CardHeader>
        <Separator className="bg-gray-300 dark:bg-gray-800" />
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-300">Inicia sesión para ver las habilidades.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-none shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Habilidades</CardTitle>
      </CardHeader>
      <Separator className="bg-gray-300 dark:bg-gray-800" />
      <CardContent className="pt-6">
        {skills.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-300">
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No hay habilidades disponibles.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CardHabilidades;
