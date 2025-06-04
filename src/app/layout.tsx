'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { Toaster } from "sonner";
import { inter } from './fonts'; // ✅ fuente importada desde archivo común

// Crear una instancia de QueryClient
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <title>LureTFG</title>
      </head>
      <body className="font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
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
