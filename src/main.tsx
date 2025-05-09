
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/main.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

// Function to safely initialize the app
const initializeApp = () => {
  // Make sure DOM is ready before mounting
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  try {
    // Create root with error handling
    const root = createRoot(rootElement);
    
    root.render(
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    );
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
      }
    } catch (e) {
      // Last resort
      document.body.innerHTML = '<h1>Failed to load application. Please refresh the page.</h1>';
    }
  }
};

// Check if document is fully loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  // Document is already ready, initialize right away
  setTimeout(initializeApp, 0);
} else {
  // Document not ready, wait for load
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 0);
  });
}
