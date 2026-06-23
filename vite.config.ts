import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // 1. TanStack Start debe ir primero
    tanstackStart({
      server: { entry: "server" },
    }),
    // 2. Luego los demás plugins
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});