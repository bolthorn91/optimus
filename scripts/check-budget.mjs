#!/usr/bin/env node
/**
 * Gate de presupuesto de bundle (perfil §5, invariante I9).
 *
 * Falla si la primera carga supera el presupuesto en gzip, o si arrastra alguno de los paquetes
 * WebGL. «Primera carga» es el chunk de entrada más el cierre transitivo de sus imports
 * estáticos: I9 no pide que WebGL esté fuera de la entrada, pide que entre por import dinámico.
 */
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import {
  CHUNK_REPORT_PATH,
  ENTRY_BUDGET_GZIP_BYTES,
  WEBGL_SCENE_BUDGET_GZIP_BYTES,
  deferredWebglChunkFiles,
  findEagerWebglModules,
  parseChunkReport,
  staticImportClosure,
} from '../tooling/bundle-policy.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const REPORT = path.join(ROOT, CHUNK_REPORT_PATH);

/**
 * @param {string} message
 * @returns {never}
 */
function fail(message) {
  console.error(`\n✖ Presupuesto de bundle: ${message}\n`);
  process.exit(1);
}

/** @param {number} bytes */
function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

if (!existsSync(DIST)) {
  fail('no existe dist/. Ejecute `npm run build` antes que `npm run build:budget`.');
}
if (!existsSync(REPORT)) {
  fail(
    `no existe ${CHUNK_REPORT_PATH}. El plugin chunkReport de vite.config.ts no se ejecutó; ` +
      'una build sin informe no se puede auditar.',
  );
}

let report;
try {
  report = parseChunkReport(JSON.parse(await readFile(REPORT, 'utf8')));
} catch (error) {
  fail(`${error instanceof Error ? error.message : String(error)}. Rehaga la build.`);
}

const eagerFiles = staticImportClosure(report.entryFile, report.chunks);

// 1 · Peso de todo lo que se descarga en la primera carga.
let eagerBytes = 0;
for (const file of eagerFiles) {
  const asset = path.join(DIST, file);
  if (!existsSync(asset)) {
    fail(`el informe apunta a ${file}, que no existe en dist/. Rehaga la build.`);
  }
  eagerBytes += gzipSync(await readFile(asset), { level: 9 }).byteLength;
}

// 2 · Ningún paquete WebGL alcanzable estáticamente desde la entrada.
const offenders = findEagerWebglModules(report.chunks, eagerFiles);

const problems = [];
if (eagerBytes > ENTRY_BUDGET_GZIP_BYTES) {
  problems.push(
    `la primera carga pesa ${formatKb(eagerBytes)} gzip en ${eagerFiles.size} chunk(s) y el ` +
      `presupuesto es ${formatKb(ENTRY_BUDGET_GZIP_BYTES)}.`,
  );
}
if (offenders.length > 0) {
  const shown = offenders
    .slice(0, 10)
    .map((o) => `    ${o.file} ← ${o.moduleId.replaceAll('\\', '/')}`);
  problems.push(
    `la primera carga arrastra ${offenders.length} módulo(s) WebGL que deben entrar por import ` +
      `dinámico o React.lazy:\n${shown.join('\n')}`,
  );
}

// 3 · El chunk diferido de la escena no supera 400 KB gzip (doc 03 F10, SAT-12).
const webglFiles = deferredWebglChunkFiles(report.chunks, eagerFiles);
let webglBytes = 0;
if (webglFiles.length === 0) {
  problems.push(
    'no hay chunk diferido de WebGL. three, R3F y postprocessing deben entrar por import ' +
      'dinámico (I9, F10).',
  );
} else {
  for (const file of webglFiles) {
    const asset = path.join(DIST, file);
    if (!existsSync(asset)) {
      fail(`el informe apunta a ${file}, que no existe en dist/. Rehaga la build.`);
    }
    webglBytes += gzipSync(await readFile(asset), { level: 9 }).byteLength;
  }
  if (webglBytes > WEBGL_SCENE_BUDGET_GZIP_BYTES) {
    problems.push(
      `el chunk WebGL pesa ${formatKb(webglBytes)} gzip en ${webglFiles.length} fichero(s) y el ` +
        `presupuesto de la escena es ${formatKb(WEBGL_SCENE_BUDGET_GZIP_BYTES)}.`,
    );
  }
}

if (problems.length > 0) {
  fail(problems.join('\n  '));
}

const deferred = report.chunks.filter((chunk) => !eagerFiles.has(chunk.file)).length;
console.log(
  `✔ Presupuesto de bundle: primera carga ${formatKb(eagerBytes)} gzip en ${eagerFiles.size} ` +
    `chunk(s) de ${formatKb(ENTRY_BUDGET_GZIP_BYTES)} · ${deferred} chunk(s) diferido(s) · ` +
    'sin WebGL en la primera carga · escena WebGL ' +
    `${formatKb(webglBytes)} gzip de ${formatKb(WEBGL_SCENE_BUDGET_GZIP_BYTES)}.`,
);
