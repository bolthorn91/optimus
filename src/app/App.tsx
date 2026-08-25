import { DesignPage } from '@/pages/DesignPage';

/**
 * Sin router todavía, la aplicación es la propia página de muestra: es la única superficie que
 * existe. Pasa a su ruta `/design` cuando el shell la tenga.
 */
export function App() {
  return <DesignPage />;
}
