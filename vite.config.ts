import path from "path"
import react from "@vitejs/plugin-react-swc"
import {defineConfig} from "vite"

export default defineConfig({
  base: "/sky-s2t-web/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
