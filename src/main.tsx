
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Simple initialization function with improved error handling
const initializeApp = () => {
  console.log("Initializing app...");
  
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found!');
    return;
  }
  
  try {
    // Create root with simplified approach
    const root = createRoot(rootElement);
    
    // Render React application with minimal wrapper
    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.StrictMode>
    );
    console.log("Application rendered successfully");
  } catch (error) {
    console.error('Failed to render application:', error);
  }
};

// Ensure document is ready before attempting to render
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeApp();
} else {
  document.addEventListener('DOMContentLoaded', initializeApp);
}
