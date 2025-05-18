"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { useAuth } from "@/app/context/AuthContext"; // 🔥 Importamos el contexto de autenticación
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import BackButton from "@/components/ui/BackButton"; // Ajusta la ruta según tu estructura de carpetas



export default function LoginPage() {
  const { setUser } = useAuth(); // 🔥 Obtiene la función para actualizar el usuario en el contexto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("❌ Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await Axios.post(
        "/api/auth/login",
        { user_handle: username, password, rememberMe },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // 🔥 Obtiene el perfil del usuario después del login
        const userData = await fetch("/api/auth/profile", { credentials: "include" })
          .then((res) => res.json());

        if (userData.authenticated) {
          setUser(userData.user); // ✅ Guarda el usuario en el contexto global
          router.push("/"); // ✅ Redirige al home después del login
        } else {
          setError("❌ Error al recuperar el perfil. Inténtalo de nuevo.");
        }
      }
    } catch (err: any) {
      setError(err.response?.data || "❌ Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-300 via-blue-700 to-blue-950 dark:from-gray-950 dark:via-blue-900 dark:to-gray-950 relative overflow-hidden">

      {/* Patrón de fondo animado */}
      <div className="absolute inset-0 w-full h-full">
        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeWidth="0.1">
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="M0,0 L100,0 L100,100 L0,100 Z;
                    M0,10 L90,0 L100,90 L10,100 Z;
                    M0,0 L100,0 L100,100 L0,100 Z"
            />
          </path>
        </svg>
      </div>

      {/* Texto login lado izquierdo */}
      <div className="flex items-center lg:pl-56 lg:mr-16 lg:ml-10 mb-20">
         <BackButton href="/" />
        <div className="text-white space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">Bienvenido a Lure</h1>
          <p className="text-3sm md:text-lg lg:text-xl">Accede a tu cuenta</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm md:max-w-xl lg:max-w-2xl bg-white dark:bg-gray-900 flex items-center shadow-2xl rounded-xl mx-auto p-6 mb-40 md:p-10 lg:mr-16 xl:mr-40 lg:mb-0 relative z-10">
        <div className="w-full space-y-8">
          <div className="flex justify-center">
            <Image src="/logo.png" alt="Logo de LA ISLA DE LURE" width={100} height={140} className="mb-3 lg:w-[180px]" priority />
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Nombre de Usuario"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Contraseña"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                  className="text-blue-500 dark:text-blue-400"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                >
                  Recuérdame
                </label>
              </div>

              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
                type="submit"
                disabled={loading}
              >
                {loading ? "Iniciando..." : "Iniciar sesión"}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
          </form>

          {/* Enlace para volver al inicio */}
          <div className="mt-6 text-center">

            <Link href="/pages/register" className=" text-sm text-blue-500 hover:text-blue-600">
              ¿Aún no tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
