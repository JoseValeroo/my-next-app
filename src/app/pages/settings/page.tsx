"use client"
import { useState } from "react"
import { SettingsNav } from "@/components/settings_C/settings-nav"
import { ActivityHeatmap } from "@/components/settings_C/activity-heatmap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { HiMenu, HiX } from "react-icons/hi"

export default function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-200 dark:bg-gray-950">
      {/* Aside para pantallas grandes oculto en pequeñas */}
      <aside className={`md:flex md:w-84 md:flex-col md:fixed md:inset-y-0 dark:bg-gray-950 transition-all duration-300 ease-in-out ${isMenuOpen ? "block z-50" : "hidden"} md:block backdrop-blur-sm`}>
        {/* Boton X para cerrar menu */}
        <div className="flex justify-end p-4 md:hidden">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close Menu" className="text-xl text-gray-900 dark:text-white">
            <HiX />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-sm sm:text-base">
          <SettingsNav />
        </div>
      </aside>

      {/* Capa de fondo */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-white/50 dark:bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Icono de hamburguesa solo en pantallas pequeñas */}
      {!isMenuOpen && (
        <button
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          className="fixed top-6 left-4 z-50 p-2 bg-none md:hidden"
        >
          <HiMenu className="h-5 w-5 text-gray-900 dark:text-gray-300" />
        </button>
      )}
    
      {/* Main content */}
      <main className="flex-1 w-full md:pl-72 p-4 ml-4">
        <div className="max-w-[1900px]">
          <div className="flex items-center space-x-4">
            <div className="flex ml-4 mt-2 mb-4 items-center px-4 text-gray-600 dark:text-white">
                <span className="font-semibold text-xl sm:text-2xl lg:text-4xl ">Configuración</span>
            </div>
          </div>

          <div className="grid gap-8 mt-4">
            <ActivityHeatmap />

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <SettingsCard
                title="Contenido"
                description="Gestiona tu contenido"
                settings={[
                  { id: "nsfw", label: "Contenido no seguro (NSFW)" },
                  { id: "analytics", label: "Compartir análisis", defaultChecked: true },
                  { id: "marketing", label: "Emails de marketing" },
                ]}
              />

              <SettingsCard
                title="Privacidad"
                description="Gestiona tu privacidad"
                settings={[
                  { id: "public-profile", label: "Perfil público", defaultChecked: true },
                  { id: "show-activity", label: "Mostrar actividad", defaultChecked: true },
                  { id: "third-party", label: "Compartir con terceros" },
                ]}
              />

              <SettingsCard
                title="Notificaciones"
                description="Gestiona tu notificaciones"
                settings={[
                  { id: "email-notif", label: "Notificaciones Email", defaultChecked: true },
                  { id: "push-notif", label: "Notificaciones Push", defaultChecked: true },
                  { id: "updates", label: "Actualizaciones de producto", defaultChecked: true },
                ]}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function SettingsCard({ title, description, settings }) {
  return (
    <Card className="bg-white dark:bg-gray-900 w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between gap-4">
            <Label htmlFor={setting.id} className="text-sm text-gray-900 dark:text-gray-100 truncate">
              {setting.label}
            </Label>
            <Switch id={setting.id} defaultChecked={setting.defaultChecked} className="shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}