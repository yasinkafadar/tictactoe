import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ui/App.tsx'
import './index.css'
import { initializePostHog } from './lib/posthog.ts'

// Debug environment variables
const meta = import.meta as any;
console.log('🔍 Main.tsx - All env vars:', meta.env);
console.log('🔍 Main.tsx - PostHog Key:', meta.env?.VITE_PUBLIC_POSTHOG_KEY);
console.log('🔍 Main.tsx - Sentry DSN:', meta.env?.VITE_SENTRY_DSN);

// Initialize analytics
initializePostHog().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
