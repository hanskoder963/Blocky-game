import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Bytt 'Blocky-game' til nøyaktig repo-navn ditt
export default defineConfig({
  plugins: [react()],
  base: "/Blocky-game/",
});
