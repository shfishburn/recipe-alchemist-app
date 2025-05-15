import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Allow connections from the sandbox
    host: "0.0.0.0", 
    port: 8080,
    // Ensure proper HMR configuration
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
    // Add explicit CORS support
    cors: true,
    // Allow requests from Lovable sandbox host
    allowedHosts: [
      "all", 
      "localhost",
      "*.lovableproject.com",
      "9da91218-18b0-4fc0-991c-29a180c2ef2e.lovableproject.com"
    ],
    // Add proper SPA fallback for client-side routing
    proxy: {
      // Proxy API requests if needed
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
    // Set proper mime types to ensure React loads correctly
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Type': 'application/javascript; charset=utf-8'
    },
    // Add middleware for SPA routing
    middlewares: [
      (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        // Force JavaScript content type for JS files
        if (req.url?.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        next();
      }
    ]
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
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: './postcss.config.cjs'
  },
  build: {
    outDir: 'dist',
    minify: true,
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@/components/ui/button', '@/components/ui/dialog', '@/components/ui/form'],
          'recipe-components': ['@/components/recipe-detail/RecipeDetailContent', '@/components/quick-recipe/QuickRecipeGenerator']
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    modulePreload: {
      polyfill: true,
    }
  },
  // Ensure SPA routing works correctly
  base: '/',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
  },
}));