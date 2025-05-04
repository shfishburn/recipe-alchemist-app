
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/main.css'
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

// Make sure DOM is ready before mounting
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found');
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
