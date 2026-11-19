import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Treino do Pai",
    short_name: "Treino",
    description: "Plano de treino semanal: Push, Pull e Misto.",
    lang: "pt-PT",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a09",
    theme_color: "#ea580c",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
