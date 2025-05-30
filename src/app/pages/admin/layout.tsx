'use client';

import type { ReactNode } from "react";
import { Bell, Settings, User } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="h-full">
      <header className="h-20 bg-white dark:bg-gray-900 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between px-4">
        <h1 className="text-2xl text-gray-900 dark:text-white">Panel de administrador</h1>
        <div className="flex items-center gap-4">
          <button className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Bell className="h-7 w-7 text-zinc-600 dark:text-white" />
          </button>
          <button
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => router.push("/pages/settings")}
          >
            <Settings className="h-7 w-7 text-zinc-600 dark:text-white" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 border border-gray-300 dark:border-gray-600 cursor-pointer">
                <AvatarImage src={user?.avatarUrl} alt="Admin Avatar" />
                <AvatarFallback>
                  <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => router.push("/")}>Ir a inicio</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="h-[calc(100%-3rem)]">{children}</main>
    </div>
  );
}
