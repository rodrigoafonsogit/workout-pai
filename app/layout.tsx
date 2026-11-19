import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Treino do Pai",
  description: "Plano de treino semanal: Push, Pull e Misto.",
  appleWebApp: { capable: true, title: "Treino", statusBarStyle: "default" },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className="min-h-dvh antialiased">
        <div className="mx-auto max-w-xl px-4 pb-32 pt-[max(1.5rem,env(safe-area-inset-top))]">{children}</div>
      </body>
    </html>
  );
}
