import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    noExternal: ["zod", "react-hook-form", "@hookform/resolvers"],
  },
  optimizeDeps: {
    include: ["zod", "react-hook-form", "@hookform/resolvers"],
  },
});
