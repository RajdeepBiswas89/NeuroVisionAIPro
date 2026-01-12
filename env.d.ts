/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Module augmentation to fix framer-motion className types
declare module 'framer-motion' {
  interface MotionProps {
    className?: string;
  }
}
