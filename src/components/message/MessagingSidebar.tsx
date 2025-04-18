"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
// Importa tus funciones de service
import { 
  fetchUserByQuery, 
  addContact as addContactService, 
  fetchFollowing, 
  fetchRecentChats  // Usaremos este endpoint para obtener los contactos
} from '@/server/service/messageService';

export default function MessagingSidebar({ onSelectContact }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [userResult, setUserResult] = useState(null);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState([]);
  const [contacts, setContacts] = useState([]); // Renombramos "recentChats" a "contacts"

  // Búsqueda de usuario
  const handleSearch = async () => {
    try {
      const user = await fetchUserByQuery(searchTerm);
      if (user) {
        setUserResult(user);
        setError('');
      } else {
        setUserResult(null);
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError('Error en la búsqueda');
    }
  };

  const handleAddContact = async () => {
    try {
      await addContactService(userResult.user_id);
      setUserResult(null);
      // Actualizamos la lista de contactos
      await updateContacts();
      onSelectContact(userResult);
    } catch (err) {
      console.error("Error al agregar contacto", err);
    }
  };
  
  const updateContacts = async () => {
    try {
      const chatsData = await fetchRecentChats();
      console.log("Datos actualizados de contactos:", chatsData);
      setContacts(chatsData);
    } catch (err) {
      console.error("Error al actualizar contactos", err);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadLists = async () => {
      try {
        const followingData = await fetchFollowing();
        setFollowing(followingData);
        await updateContacts();
      } catch (err) {
        console.error("Error al cargar las listas", err);
      }
    };

    loadLists();
  }, []);

  return (
    <div className="p-4 ">
      {/* Buscador */}
      <div className="mb-4 mt-16">
        <Input
          placeholder="Buscar usuario..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600"        />        
        <div className="flex justify-end mt-4 mb-4">
          <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition">Buscar</Button>
        </div>
      
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {userResult && (
        <div className="mb-4 p-2 rounded rounded-md shadow dark:bg-gray-800 p-3">
          <p className="font-bold">{userResult.user_handle}</p>
          <div className="flex gap-2">
            <Button className="mt-4 bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:text-white font-semibold text-gray-800 py-2 px-4 rounded-md transition" onClick={handleAddContact}>Agregar a contactos</Button>
          </div>
          <div className="flex gap-2">
            <Button className="mt-4 bg-gray-300 hover:bg-gray-400 dark:bg-gray-500 dark:text-white font-semibold text-gray-800 py-2 px-4 rounded-md transition" onClick={() => onSelectContact(userResult)}>Iniciar Chat</Button>
          </div>
       </div>
      )}
      

      {/* Listado de Seguidos */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded rounded-md shadow p-3">
        <h3 className="font-semibold mb-2">Seguidos</h3>
        <Separator className="mt-2 bg-gray-300 dark:bg-gray-500" />
        {following.length > 0 ? (
          following.map((user) => (
            <div key={user.user_id} className="p-2 hover:bg-blue-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer" onClick={() => onSelectContact(user)}>
              <p>{user.user_handle}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No sigues a nadie.</p>
        )}
      </div>

      {/* Contactos */}
      <div className="mb-6 bg-white dark:bg-gray-800  rounded rounded-md shadow p-3">
        <h3 className="font-semibold mb-2">Contactos</h3>
        <Separator className="mt-2 bg-gray-300 dark:bg-gray-500" />
        {contacts.map((contact) => (
          <div key={contact.user_id} className="p-2 hover:bg-blue-100 dark:hover:bg-gray-900 rounded-lg cursor-pointer" 
              onClick={() => onSelectContact(contact)}>
            <div className="flex justify-between items-center">
              <p>{contact.user_handle}</p>
              {contact.unread_count > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {contact.unread_count}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{contact.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}