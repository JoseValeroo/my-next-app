'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HomeIcon, MessageSquare, Users2, Layout, Image, Settings, HouseIcon } from 'lucide-react'

const navItems = [
  {
    title: "Noticias",
    href: "/pages/news",
    icon: HomeIcon,
  },
  {
    title: "Mensajes",
    href: "/pages/chats",
    icon: MessageSquare,
    badge: 6,
  },
  {
    title: "Forums",
    href: "/forums",
    icon: Layout,
  },
  {
    title: "Friends",
    href: "/friends",
    icon: Users2,
    badge: 3,
  },
  {
    title: "Media",
    href: "/media",
    icon: Image,
  },
  {
    title: "Ajustes",
    href: "/pages/settings",
    icon: Settings,
  },
  {
    title: "Home",
    href: "/",
    icon: HouseIcon,
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full bg-gray-50 dark:bg-gray-950 dark:text-gray-100">
      <div className="space-y-2 p-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 text-gray-800 dark:text-gray-200",
              pathname === item.href
                ? "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-800"
            )}
            asChild
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.title}
              {item.badge && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
