'use client'

import { useEffect, useRef, useState } from "react";
import AdminLayout from "./layout";
import UserListAdmin from "@/components/AdminPage/UserListAdmin";
import TweetListAdmin from "@/components/AdminPage/TweetListAdmin";
import { Search } from "lucide-react";

export default function AdminPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  if (!isMounted) return null;

  return (
      <div className="grid grid-cols-2 gap-4 p-6 bg-white dark:bg-gray-900 min-h-screen">
        {/* Cuadro de Tweets */}
        <div className="bg-zinc-100 dark:bg-gray-800 rounded-xl p-4 shadow-md overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Todos los Tweets</h2>
          <TweetListAdmin />
        </div>

        {/* Cuadro de Usuarios */}
        <div className="bg-zinc-100 dark:bg-gray-800 rounded-xl p-4 shadow-md overflow-y-auto max-h-[90vh]">
          <UserListAdmin />
        </div>
      </div>
  );
}