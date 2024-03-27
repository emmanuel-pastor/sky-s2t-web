/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly  VITE_SPEECH_REGION: string,
  readonly VITE_GOOGLE_CLIENT_ID: string,
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
