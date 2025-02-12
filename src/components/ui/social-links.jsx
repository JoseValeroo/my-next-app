'use client'

import { motion } from "framer-motion"
import { Icons } from "./icons"

const socialLinks = [
  { icon: 'telegram', url: '#', color: 'bg-blue-500' },
  { icon: 'youtube', url: '#', color: 'bg-red-500' },
  { icon: 'facebook', url: '#', color: 'bg-blue-600' },
  { icon: 'twitter', url: '#', color: 'bg-black' },
]

export function SocialLinks() {
  return (
    <div className="grid grid-cols-4 gap-4 align place-items-center">
      {socialLinks.map((link) => (
        <motion.a
          key={link.icon}
          href={link.url}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex h-12 w-12 items-center justify-center rounded-full ${link.color} 
            text-white transition-shadow hover:shadow-lg `}
        >
          {Icons[link.icon]({ className: "h-5 w-5" })}
        </motion.a>
      ))}
    </div>
  )
}

