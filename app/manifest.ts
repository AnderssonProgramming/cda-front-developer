import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cocina para Uno - One Cooking",
    short_name: "OneCooking",
    description: "Tu recetario personal dinámico para cocineros solitarios",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ef4444",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["food", "lifestyle", "productivity"],
    lang: "es",
    orientation: "portrait-primary",
    scope: "/",
  }
}
