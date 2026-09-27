import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const getPreset = () => {
  if (process.env.NITRO_PRESET) return process.env.NITRO_PRESET;
  if (process.env.NETLIFY) return "netlify";
  if (process.env.VERCEL) return "vercel";
  return undefined;
};

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro({
      preset: getPreset(),
    }),
    viteReact(),
  ],
  server: {
    port: 3000,
    host: true,
  },
});
