/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // another variables
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
