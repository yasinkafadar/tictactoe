import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ui/App.tsx'
import './index.css'
import { initializePostHog } from './lib/posthog.ts'

// Initialize analytics
initializePostHog().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
