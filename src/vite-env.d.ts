/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_POSTHOG_KEY?: string
  readonly VITE_POSTHOG_HOST?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_BUILD_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
