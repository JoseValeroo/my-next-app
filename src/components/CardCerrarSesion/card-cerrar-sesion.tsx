"use client";

import { LogOut } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext"; // Importa el contexto de autenticación

export default function CardCerrarSesion() {
  const [isHovering, setIsHovering] = useState(false);
  const { user, logout } = useAuth(); // Obtiene el usuario y la función de logout

  // 🔥 Si no hay usuario logueado, no se renderiza la card
  if (!user) return null;

  return (
    <Card
      className="w-full max-w-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg 
      bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <LogOut
            className={`w-5 h-5 transition-colors duration-300 
            ${isHovering ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}
          />
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Cerrar sesión
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          ¿Estás seguro que deseas cerrar tu sesión? Necesitarás volver a iniciar sesión para acceder a tu cuenta.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          className="w-full transition-all duration-300 hover:bg-red-600 active:bg-red-700 
          dark:hover:bg-red-500 dark:active:bg-red-600"
          onClick={logout} // 🔥 Ahora usa la función de logout desde `useAuth()`
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </CardFooter>
    </Card>
  );
}
