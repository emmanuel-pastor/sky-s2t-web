/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPEECH_KEY: string,
  readonly  VITE_SPEECH_REGION: string,
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
