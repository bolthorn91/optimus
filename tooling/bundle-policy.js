/**
 * Política de bundle del proyecto (perfil §5, invariante I9): qué paquetes no pueden llegar a la
 * primera carga, cuánto puede pesar esa carga, cuál es el contrato del informe de chunks, y cómo
 * se recorre el grafo para decidir si la política se cumple.
 *
 * En JavaScript y no en TypeScript a propósito: lo consumen `vite.config.ts` (que sí pasa por
 * tsc) y `scripts/check-budget.mjs` (que lo ejecuta Node sin compilar). Un solo fichero evita
 * que el contrato y el predicado se separen entre quien reparte los chunks y quien los audita.
 */

/**
 * Contrato del informe de chunks. Lo escribe `chunk-report-plugin.ts` y lo lee
 * `scripts/check-budget.mjs`; vive aquí para que escritor y lector no puedan divergir.
 *
 * @typedef {object} ChunkEntry
 * @property {string} file
 * @property {boolean} isEntry
 * @property {string[]} moduleIds
 * @property {string[]} imports         chunks que este importa de forma estática
 * @property {string[]} dynamicImports  chunks que este importa dinámicamente
 */

/**
 * @typedef {object} ChunkReport
 * @property {string} entryFile
 * @property {ChunkEntry[]} chunks
 */

/**
 * Paquetes WebGL por identidad de paquete npm, no por substring de ruta.
 * `three-stdlib` entra porque drei lo arrastra; no se infiere de `three`.
 */
export const WEBGL_PACKAGES = /** @type {const} */ (['three', 'three-stdlib', 'postprocessing']);

/** Scopes cuyo árbol entero es WebGL (`@react-three/fiber`, `/drei`, …). */
export const WEBGL_SCOPES = /** @type {const} */ (['@react-three']);

/** Nombre del chunk diferido donde acaban. */
export const WEBGL_CHUNK_NAME = 'webgl';

/** Presupuesto del chunk de entrada, en bytes ya comprimidos con gzip. */
export const ENTRY_BUDGET_GZIP_BYTES = 250 * 1024;

/** Presupuesto del chunk diferido de la escena WebGL (doc 03 F10), gzip. */
export const WEBGL_SCENE_BUDGET_GZIP_BYTES = 400 * 1024;

/** Ruta relativa del informe de chunks. Fuera de `dist/`: no debe publicarse. */
export const CHUNK_REPORT_PATH = '.build-report/chunk-report.json';

/**
 * Nombre de paquete npm del módulo (`three`, `@react-three/fiber`), o `null` si no viene de
 * `node_modules`. Usa el último `/node_modules/` para pnpm y anidamientos.
 *
 * @param {string} moduleId
 * @returns {string | null}
 */
export function nodeModulePackage(moduleId) {
  const normalised = moduleId.replaceAll('\\', '/');
  const marker = '/node_modules/';
  const at = normalised.lastIndexOf(marker);
  if (at === -1) return null;

  const rest = normalised.slice(at + marker.length);
  if (rest.length === 0) return null;

  if (rest.startsWith('@')) {
    const slash = rest.indexOf('/');
    if (slash === -1) return null;
    const next = rest.indexOf('/', slash + 1);
    const name = next === -1 ? rest : rest.slice(0, next);
    return name.includes('/') ? name : null;
  }

  const slash = rest.indexOf('/');
  return slash === -1 ? rest : rest.slice(0, slash);
}

/**
 * @param {string} moduleId
 * @returns {boolean} si el módulo pertenece a un paquete WebGL.
 */
export function isWebglModule(moduleId) {
  const pkg = nodeModulePackage(moduleId);
  if (pkg === null) return false;
  if (WEBGL_PACKAGES.some((name) => name === pkg)) return true;
  return WEBGL_SCOPES.some((scope) => pkg.startsWith(`${scope}/`));
}

/** @param {unknown} value @returns {value is string[]} */
function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** @param {unknown} value @returns {value is ChunkEntry} */
function isChunkEntry(value) {
  if (typeof value !== 'object' || value === null) return false;
  const c = /** @type {Record<string, unknown>} */ (value);
  return (
    typeof c.file === 'string' &&
    typeof c.isEntry === 'boolean' &&
    isStringArray(c.moduleIds) &&
    isStringArray(c.imports) &&
    isStringArray(c.dynamicImports)
  );
}

/**
 * Valida el informe recién parseado. Un gate que se traga un informe malformado y sigue adelante
 * es peor que no tener gate: por eso esto lanza en vez de devolver un valor parcial.
 *
 * @param {unknown} raw
 * @returns {ChunkReport}
 * @throws {TypeError} si el informe no tiene la forma esperada.
 */
export function parseChunkReport(raw) {
  if (typeof raw !== 'object' || raw === null) {
    throw new TypeError('el informe de chunks no es un objeto');
  }

  const report = /** @type {Record<string, unknown>} */ (raw);
  const entryFile = report.entryFile;
  const chunks = report.chunks;

  if (typeof entryFile !== 'string' || entryFile.length === 0) {
    throw new TypeError('el informe de chunks no declara ningún chunk de entrada');
  }
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new TypeError('el informe de chunks no contiene ningún chunk');
  }
  if (!chunks.every(isChunkEntry)) {
    throw new TypeError('el informe de chunks contiene una entrada con forma inesperada');
  }
  if (!chunks.some((chunk) => chunk.file === entryFile)) {
    throw new TypeError(`el informe no contiene el chunk de entrada ${entryFile}`);
  }

  return { entryFile, chunks };
}

/**
 * Chunks que el navegador descarga en la primera carga: la entrada y el cierre transitivo de sus
 * imports **estáticos**. Los `dynamicImports` no entran, que es justo la diferencia que I9 exige.
 *
 * @param {string} entryFile
 * @param {ChunkEntry[]} chunks
 * @returns {Set<string>} nombres de fichero alcanzables estáticamente desde la entrada.
 */
export function staticImportClosure(entryFile, chunks) {
  /** @type {Map<string, ChunkEntry>} */
  const byFile = new Map(chunks.map((chunk) => [chunk.file, chunk]));
  /** @type {Set<string>} */
  const reachable = new Set();
  /** @type {string[]} */
  const pending = [entryFile];

  while (pending.length > 0) {
    const file = pending.pop();
    if (file === undefined || reachable.has(file)) continue;
    reachable.add(file);

    const chunk = byFile.get(file);
    if (!chunk) continue;
    for (const imported of chunk.imports) pending.push(imported);
  }

  return reachable;
}

/**
 * Módulos WebGL que llegarían a la primera carga, con el chunk por el que entran.
 *
 * @param {ChunkEntry[]} chunks
 * @param {Set<string>} eagerFiles cierre estático devuelto por `staticImportClosure`
 * @returns {{ file: string; moduleId: string }[]}
 */
export function findEagerWebglModules(chunks, eagerFiles) {
  /** @type {{ file: string; moduleId: string }[]} */
  const offenders = [];

  for (const chunk of chunks) {
    if (!eagerFiles.has(chunk.file)) continue;
    for (const moduleId of chunk.moduleIds) {
      if (isWebglModule(moduleId)) offenders.push({ file: chunk.file, moduleId });
    }
  }

  return offenders;
}

/**
 * Chunks diferidos que portan el motor WebGL: el chunk nombrado `webgl` o cualquiera que
 * contenga módulos de la lista. La entrada ya se filtró; lo que queda es el peso de SAT-12.
 *
 * @param {ChunkEntry[]} chunks
 * @param {Set<string>} eagerFiles
 * @returns {string[]}
 */
export function deferredWebglChunkFiles(chunks, eagerFiles) {
  /** @type {string[]} */
  const files = [];

  for (const chunk of chunks) {
    if (eagerFiles.has(chunk.file)) continue;
    const base = (chunk.file.replaceAll('\\', '/').split('/').pop() ?? '').toLowerCase();
    const named =
      base.startsWith(`${WEBGL_CHUNK_NAME}-`) || base.startsWith(`${WEBGL_CHUNK_NAME}.`);
    if (named || chunk.moduleIds.some(isWebglModule)) files.push(chunk.file);
  }

  return files;
}
