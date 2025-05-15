import { defineConfig } from "vite";

import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Allow connections from the sandbox
    host: "0.0.0.0", 
    port: 8080,
    // Add historyApiFallback for SPA routing
    hmr: {
      protocol: 'ws',
    },
    // Add explicit CORS support
    cors: true,
    // Allow requests from Lovable sandbox host - include multiple patterns
    allowedHosts: [
      "all", 
      "localhost",
      "*.lovableproject.com",
      "9da91218-18b0-4fc0-991c-29a180c2ef2e.lovableproject.com"
    ],
    // Add proxy configuration for potential API requests
    proxy: {
      // Proxy API requests if needed
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
    // Remove Content-Type override so HTML is served as text/html
    headers: {
      // Removed forced Content-Type so HTML is served correctly as text/html
      'X-Content-Type-Options': 'nosniff'
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
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
  // Ensure build optimization for better performance
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: true,
    target: 'esnext',
    // Add module splitting to improve loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks - referencing specific modules instead of directories
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@/components/ui/button', '@/components/ui/dialog', '@/components/ui/form'],
          'recipe-components': ['@/components/recipe-detail/RecipeDetailContent', '@/components/quick-recipe/QuickRecipeGenerator']
        },
        // Ensure proper MIME types for generated assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Set chunkSizeWarningLimit to a higher value
    chunkSizeWarningLimit: 1000,
    // Improve module resolution and caching
    modulePreload: {
      polyfill: true,
    }
  },
  // Add base configuration to ensure proper asset resolution
  base: '/',
  // Configure optimization splitting so dynamic imports work properly
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
  },
}));
