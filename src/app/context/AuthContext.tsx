'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Creamos el contexto con valor por defecto null
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔄 Al montar el contexto, pedimos el perfil autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🧠 Comprobando autenticación desde AuthContext...");
        const res = await fetch("/api/auth/profile", { credentials: "include" });
        const data = await res.json();

        if (data.authenticated) {
          console.log("✅ Usuario autenticado:", data.user);
          setUser(data.user);
        } else {
          console.warn("⚠️ Usuario no autenticado.");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error al verificar autenticación:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔒 Cerrar sesión
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      console.log("🚪 Sesión cerrada correctamente.");
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
