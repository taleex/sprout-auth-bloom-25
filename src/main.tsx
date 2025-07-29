import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, setupPWAInstall } from './utils/pwa'

// Initialize PWA features
registerServiceWorker();
setupPWAInstall();

// Apply initial system theme before React renders
const applyInitialTheme = () => {
  try {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDark ? 'dark' : 'light');
  } catch (error) {
    // Fallback to light theme if there's any error
    document.documentElement.classList.add('light');
  }
};

applyInitialTheme();

console.log('🚀 NEW main.tsx loaded - Fixed version without debug components!');

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);