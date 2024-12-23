import type { Metadata } from "next"
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Social Feed",
  description: "A modern social media feed application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}

