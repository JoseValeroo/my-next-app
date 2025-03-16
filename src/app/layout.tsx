'use client'; // Esto asegura que el siguiente código solo se ejecute en el cliente

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext'; // 🔥 Importa el contexto de perfil
import { Toaster } from "sonner";

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

// Configuración de fuentes con variables CSS
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Usamos variables para CSS
  fallback: ['system-ui', 'arial'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair', // Usamos variables para CSS
  fallback: ['georgia', 'times new roman'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>LureTFG</title>
      </head>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <AuthProvider> {/* 🔥 Toda la app tiene acceso a la autenticación */}
            <ProfileProvider>
              {children}
              <Toaster position="top-right" richColors expand={true} />
            </ProfileProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
