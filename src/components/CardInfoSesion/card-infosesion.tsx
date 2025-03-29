import { useEffect, useState } from "react";
import { User, ShieldCheck, LogOut } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SessionInfoCard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formattedLastLogin, setFormattedLastLogin] = useState("");

  useEffect(() => {
    if (user?.lastLogin) {
      setFormattedLastLogin(
        `${new Date(user.lastLogin).toLocaleDateString()} - ${new Date(user.lastLogin).toLocaleTimeString()}`
      );
    } else {
      setFormattedLastLogin("Fecha no disponible");
    }
  }, [user]);

  if (!user) return null;

  return (
    <Card className="w-full max-w-lg transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center gap-4 p-6">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-gray-200 dark:border-gray-700">
            <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </AvatarFallback>
          </Avatar>
          {user.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg leading-none tracking-tight text-gray-900 dark:text-gray-100">
              {user.name}
            </h3>
            <Badge variant="secondary" className="rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              Activo
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Último inicio de sesión</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{formattedLastLogin}</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {user.role === "admin" ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-red-600 px-9 text-white px-2 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </button>
              <button
                onClick={() => router.push("/pages/admin")}
                className="bg-green-600 text-white px-2 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <ShieldCheck size={18} />
                Panel de administración
              </button>
            </div>
          ) : (
            <Button
              variant="destructive"
              className="w-full transition-all duration-300 hover:bg-red-600 active:bg-red-700 dark:hover:bg-red-500 dark:active:bg-red-600"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
