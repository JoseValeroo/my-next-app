"use client";
import React, { useState } from "react";
import MessagingSidebar from "@/components/message/MessagingSidebar";
import ChatWindow from "@/components/message/ChatWindow";
import BackButton from "@/components/ui/BackButton";
import { useAuth } from "@/app/context/AuthContext";
import { Search } from "lucide-react";

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No autenticado</div>;

  const currentUserId = user.user_id;

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-200 dark:bg-gray-950 text-gray-900 dark:text-white">
      
      {/* BackButton */}
      <div className={`absolute top-4 left-4 z-50 ${isSidebarOpen ? "z-0" : "z-50"}`}>
        <BackButton href="/" />
      </div>

      {/* Icono sidebar desplegable */}
      {!isSidebarOpen && (
        <button
          className="absolute mt-24 left-4 z-50 md:hidden flex items-center" onClick={() => setIsSidebarOpen(true)}>
          <Search className="w-6 h-6" />
          <span className="ml-2">Buscar...</span> {/* El margen está después del ícono */}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${isSidebarOpen? "fixed inset-y-0 left-0 z-40 translate-x-0":"-translate-x-full fixed inset-y-0 left-0 z-40"} 
        transform transition-transform duration-300 ease-in-out w-2/3 max-w-xs bg-white dark:bg-gray-900 shadow-lg border-r border-gray-300 dark:border-gray-800 md:relative md:translate-x-0 md:w-1/3 md:max-w-none md:z-auto md:shadow-none md:border-r`}>
        
        {/* Icono X cerrar sidebar */}
        {isSidebarOpen && (
          <div className="p-4 flex justify-end md:hidden">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-xl font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* MessagingSidebar */}
        <MessagingSidebar
          onSelectContact={(contact) => {
            setSelectedContact(contact);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* ChatWindow */}
      <div className="flex-1 h-full mt-28 md:mt-2 p-4">
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
