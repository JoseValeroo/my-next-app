"use client";
import React, { useState } from "react";
import MessagingSidebar from "@/components/message/MessagingSidebar";
import ChatWindow from "@/components/message/ChatWindow";
import BackButton from "@/components/ui/BackButton";
import { useAuth } from "@/app/context/AuthContext"; // Ajusta la ruta según la ubicación real de tu AuthContext

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(null);
  const { user, loading } = useAuth();

  // Muestra un estado de carga mientras se verifica la autenticación
  if (loading) return <div>Loading...</div>;
  
  // Si el usuario no está autenticado, puedes redirigir o mostrar un mensaje
  if (!user) return <div>No autenticado</div>;

  // Extrae el ID real del usuario autenticado
  const currentUserId = user.user_id; // O user.id, según cómo almacenes el ID

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="w-1/3 border-r border-gray-300 dark:border-gray-800 shadow-lg">
        <BackButton href="/" />
        <MessagingSidebar onSelectContact={(contact) => setSelectedContact(contact)} />
      </div>
      <div className="w-2/3">
        {selectedContact ? (
          <ChatWindow contact={selectedContact} currentUserId={currentUserId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Selecciona un contacto para iniciar el chat</p>
          </div>
        )}
      </div>
    </div>
  );
}