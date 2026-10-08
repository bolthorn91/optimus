/// <reference types="vite/client" />

/**
 * Solo claves `VITE_*` con valor público (perfil §7 I8). Declaradas aquí para que
 * `src/lib/env.ts` lea `import.meta.env` con tipos y sin castings.
 */
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_ANALYTICS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
