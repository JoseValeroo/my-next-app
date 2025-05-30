'use client'

import { useEffect, useRef, useState } from "react";
import AdminLayout from "./layout";
import UserListAdmin from "@/components/AdminPage/UserListAdmin";
import TweetListAdmin from "@/components/AdminPage/TweetListAdmin";
import { Search } from "lucide-react";

export default function AdminPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"tweets" | "users">("tweets");


  useEffect(() => {
    setIsMounted(true);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  if (!isMounted) return null;

return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      
      {/* Tabs para pantallas pequeñas */}
      <div className="flex justify-center mb-4  lg:hidden">
        <button
          className={`px-4 py-2 rounded-l-xl font-medium ${activeTab === "tweets" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}
          onClick={() => setActiveTab("tweets")}>Tweets </button>

        <button 
          className={`px-4 py-2 rounded-r-xl font-medium ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}
          onClick={() => setActiveTab("users")}> Usuarios </button>
      </div>

      
      <div className="flex flex-row transition-all duration-1000 overflow-hidden gap-4">
        {/* Tweets */}
        <div
          className={`transition-all duration-1000 ease-in-out overflow-hidden ${activeTab === "tweets" ? "w-full" : "w-0"} lg:w-1/2`}
        >
          <div className="bg-zinc-100 dark:bg-gray-800 rounded-xl p-4 shadow-md h-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Todos los Tweets
            </h2>
            <TweetListAdmin />
          </div>
        </div>

        {/* Usuarios */}
        <div
          className={`transition-all duration-1000 ease-in-out overflow-hidden ${activeTab === "users" ? "w-full" : "w-0"} lg:w-1/2`}
        >
          <div className="bg-zinc-100 dark:bg-gray-800 rounded-xl p-4 shadow-md h-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Lista de Usuarios
            </h2>
            <UserListAdmin />
          </div>
        </div>
      </div>
    </div>
  );
}