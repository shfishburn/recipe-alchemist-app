
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Add historyApiFallback to handle client-side routing
    historyApiFallback: true,
    // Allow requests from Lovable sandbox host
    allowedHosts: ["all", "9da91218-18b0-4fc0-991c-29a180c2ef2e.lovableproject.com"],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    // Enable CSS modules for all CSS files
    modules: {
      localsConvention: 'camelCase',
    },
    // Apply PostCSS to all CSS files
    postcss: './postcss.config.cjs'
  },
}));
