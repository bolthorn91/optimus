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

/** Paquetes que nunca pueden llegar a la primera carga. */
export const WEBGL_PATTERNS = /** @type {const} */ (['three', '@react-three/', 'postprocessing']);

/** Nombre del chunk diferido donde acaban. */
export const WEBGL_CHUNK_NAME = 'webgl';

/** Presupuesto del chunk de entrada, en bytes ya comprimidos con gzip. */
export const ENTRY_BUDGET_GZIP_BYTES = 250 * 1024;

/** Ruta relativa del informe de chunks. Fuera de `dist/`: no debe publicarse. */
export const CHUNK_REPORT_PATH = '.build-report/chunk-report.json';

/**
 * @param {string} moduleId
 * @returns {boolean} si el módulo pertenece a un paquete WebGL.
 *
 * Se ancla a `node_modules/` para que un fichero propio llamado `three-column.ts` no acabe
 * arrastrado al chunk diferido.
 */
export function isWebglModule(moduleId) {
  const normalised = moduleId.replaceAll('\\', '/');
  return WEBGL_PATTERNS.some((pattern) => normalised.includes(`/node_modules/${pattern}`));
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
