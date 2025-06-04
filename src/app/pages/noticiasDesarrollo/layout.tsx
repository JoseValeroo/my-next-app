// app/pages/noticias/layout.tsx
import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
  title: "Lure - Noticias",
  description: "Mantente al día con las últimas actualizaciones y noticias de Lure",
};

export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
