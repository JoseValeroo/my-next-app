'use client'

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft } from 'lucide-react'

export default function MusicPage() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6"
    >
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-white"
      >
        <ArrowLeft className="h-6 w-6" />
        Back
      </button>
      <h1 className="mb-6 text-3xl font-bold text-white">Music</h1>
      {/* Add your music player content here */}
    </motion.div>
  )
}

