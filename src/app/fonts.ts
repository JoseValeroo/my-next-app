import { Inter, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'arial'],
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  fallback: ['georgia', 'times new roman'],
});
// This file defines the fonts used in the application.