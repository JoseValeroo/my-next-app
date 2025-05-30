import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { cn } from "../lib/utils"
import { User, Bell, Shield, BarChart3, Eye, Globe, Key, CreditCard, MessageSquare, Database, Home } from 'lucide-react'

const settingsNav = [
  {
    section: "Mi cuenta",
    items: [
     {
        name: "Inicio",
        href: "/",
        icon: Home,
     },
     {
        name: "Perfil",
        href: "/pages/profile",
        icon: User,
      },
      {
        name: "Notificaciones",
        href: "/settings/notifications",
        icon: Bell,
      },
      {
        name: "Privacidad & Seguridad",
        href: "/settings/privacy",
        icon: Shield,
      },
    ],
  },
  {
    section: "Preferencias",
    items: [
      {
        name: "Contenido",
        href: "/settings/filters",
        icon: Eye,
      },
      {
        name: "Idioma & Región",
        href: "/settings/language",
        icon: Globe,
      },
      {
        name: "Accessibilidad",
        href: "/settings/accessibility",
        icon: MessageSquare,
      },
    ],
  },
  {
    section: "Análisis & Datos",
    items: [
      {
        name: "Uso de datos",
        href: "/settings/usage",
        icon: BarChart3,
      },
      {
        name: "Exportar datos",
        href: "#",
        icon: Database,
        action: true
      },
    ],
  },
  {
    section: "Billing",
    items: [
      {
        name: "Métodos de pago",
        href: "/settings/payment",
        icon: CreditCard,
      },
      {
        name: "APIs",
        href: "/settings/api-keys",
        icon: Key,
      },
    ],
  },
]

interface SettingsNavProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SettingsNav({ className, ...props }: SettingsNavProps) {
  const { user } = useAuth();

  const handleExport = async () => {
    if (!user?.user_id) return;
    try {
      const res = await fetch(`/api/admin/users/${user.user_id}/pdf`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Error al descargar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `usuario_${user.user_id}.pdf`;
      link.click();
    } catch (err) {
      console.error("❌ Error al exportar datos:", err);
    }
  }

  return (
    <nav className={cn("space-y-6", className)} {...props}>
      {settingsNav.map((section) => (
        <div key={section.section} className="rounded-lg bg-white dark:bg-gray-900 p-4 shadow-lg">
          <h3 className="px-3 text-xl font-semibold text-gray-900 dark:text-gray-400 mb-2">
            {section.section}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => (
              item.action ? (
                <button
                  key={item.name}
                  onClick={handleExport}
                  className="w-full text-left group flex items-center rounded-lg px-4 py-2 transition-colors ease-in-out duration-200 text-gray-900 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-gray-600"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-500 transition-colors ease-in-out duration-200 dark:text-gray-400 dark:group-hover:text-white" />
                  <span>{item.name}</span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center rounded-lg px-4 py-2 transition-colors ease-in-out duration-200 text-gray-900 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-gray-600"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-500 transition-colors ease-in-out duration-200 dark:text-gray-400 dark:group-hover:text-white" />
                  <span>{item.name}</span>
                </Link>
              )
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
