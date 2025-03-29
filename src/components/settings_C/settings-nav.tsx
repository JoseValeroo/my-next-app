import Link from "next/link"
import { cn } from "../lib/utils"
import { User, Bell, Shield, BarChart3, Eye, Globe, Key, CreditCard, MessageSquare, Database, Home } from 'lucide-react'

const settingsNav = [
  {
    section: "Cuenta",
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
        name: "Notificationes",
        href: "/settings/notifications",
        icon: Bell,
      },
      {
        name: "Privacidad",
        href: "/settings/privacy",
        icon: Shield,
      },
    ],
  },
  {
    section: "Preferences",
    items: [
      {
        name: "Filtros de contenido",
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
        name:"Datos de uso",
        href: "/settings/usage",
        icon: BarChart3,
      },
      {
        name: "Exportar datos",
        href: "/settings/export",
        icon: Database,
      },
    ],
  },
  {
    section: "Facturación",
    items: [
      {
        name: "Métodos de pago",
        href: "/settings/payment",
        icon: CreditCard,
      },
      {
        name: "Claves API",
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
  return (
    <nav className={cn("space-y-6", className)} {...props}>
  {settingsNav.map((section) => (
    <div key={section.section} className="rounded-lg bg-white dark:bg-gray-900 p-4 shadow-lg">
      <h3 className="px-3 text-xl font-semibold text-gray-900 dark:text-gray-400 mb-2">
        {section.section}
      </h3>
      <div className="space-y-1">
        {section.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center rounded-lg px-4 py-2 transition-colors ease-in-out duration-200 text-gray-900 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-gray-600"
          >
            <item.icon className="mr-3 h-5 w-5 text-gray-500 transition-colors ease-in-out duration-200 dark:text-gray-400 dark:group-hover:text-white" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  ))}
</nav>

  )
}
