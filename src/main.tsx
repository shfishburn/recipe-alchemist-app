
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Function to safely initialize the app
const initializeApp = () => {
  console.log("Initializing app...");
  
  // Clean up any debug/test UI elements that might be showing
  try {
    const debugElements = document.querySelectorAll('.debug-overlay, .test-output, .sandbox-debug');
    debugElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        console.log("Removed debug element:", el.className);
      }
    });
  } catch (cleanupError) {
    console.error("Error during cleanup:", cleanupError);
  }

  // Make sure DOM is ready before mounting
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found - DOM may not be fully loaded');
    return;
  }
  
  try {
    console.log("Creating React root...");
    // Create root with error handling
    const root = createRoot(rootElement);
    
    console.log("Rendering React application...");
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
    
    // Attempt to show a fallback error UI
    try {
      const errorElement = document.createElement('div');
      errorElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
          <h2 style="margin-bottom: 16px; font-size: 24px; font-weight: bold;">Failed to load application</h2>
          <p style="margin-bottom: 24px;">Please try refreshing the page.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; background: #3b82f6; color: white; border-radius: 4px; cursor: pointer;">
            Reload Page
          </button>
        </div>
      `;
      
      if (rootElement) {
        rootElement.innerHTML = '';
        rootElement.appendChild(errorElement);
        console.log("Rendered fallback error UI");
      }
    } catch (e) {
      // Last resort
      console.error("Failed to render fallback UI:", e);
      document.body.innerHTML = '<h1>Failed to load application. Please refresh the page.</h1>';
    }
  }
};

// Check if document is fully loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Document is already ready, initialize right away
  console.log("Document already loaded, initializing app");
  setTimeout(initializeApp, 0);
} else {
  // Document not ready, wait for load
  console.log("Waiting for document to load");
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");
    setTimeout(initializeApp, 0);
  });
}
