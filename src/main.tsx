import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ui/App.tsx'
import './index.css'
import * as Sentry from "@sentry/browser";

// Initialize Sentry with environment variable
const meta = import.meta as any;
if (meta.env?.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: meta.env.VITE_SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    environment: meta.env?.MODE || 'development',
    release: meta.env?.VITE_APP_VERSION || '1.0.0'
  });
  console.log('🔍 Sentry initialized for production');
} else {
  console.log('🔍 Sentry not configured - no DSN provided');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
