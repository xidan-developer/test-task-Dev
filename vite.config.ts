import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "logo-pwa144.png"],
      manifest: {
        name: "My Vue PWA",
        short_name: "VuePWA",
        description: "My Vue 3 Progressive Web App",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo-pwa144.png",
            sizes: "144x144",
            type: "image/png"
          }
        ],
        screenshots: [
          {
            src: "image1.png",
            sizes: "640x579",
            type: "image/png",
            form_factor: "wide",
            label: "Application"
          },
          {
            src: "image1.png",
            sizes: "640x579",
            type: "image/png"
          }
        ]
      }

    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
