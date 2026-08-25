import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import { WEBGL_PATTERNS } from './tooling/bundle-policy.js';

const IMPORT_ORDER = {
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
  pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
  'newlines-between': 'always',
  alphabetize: { order: 'asc', caseInsensitive: true },
};

const NO_BARRELS = {
  group: ['**/index', '**/index.ts', '**/index.js'],
  message: 'Perfil §8: sin ficheros barril.',
};

/** @param {string} pkg */
const asImportGlobs = (pkg) => (pkg.endsWith('/') ? [`${pkg}*`] : [pkg, `${pkg}/*`]);

/**
 * Perfil §8: los motores de animación solo viven en src/motion, src/three y src/scenes.
 *
 * Los paquetes WebGL se derivan de `tooling/bundle-policy.js` en vez de repetirse: son la misma
 * lista que el gate de presupuesto (I9), y dos copias acaban divergiendo.
 */
const NO_ENGINES = {
  group: [
    ...WEBGL_PATTERNS.flatMap(asImportGlobs),
    ...['gsap', '@gsap', 'lenis'].flatMap(asImportGlobs),
  ],
  message:
    'Perfil §8: los motores de animación solo se importan desde src/motion/, src/three/ y ' +
    'src/scenes/. Use las primitivas de src/motion/ (useGsapScene, useScrollProgress, <Scene>).',
};

/** @param {{ group: string[]; message: string }[]} patterns */
const restrictImports = (patterns) => ['error', { patterns }];

/**
 * Capas donde los motores sí están autorizados. Un helper y no dos bloques copiados: una
 * excepción a medias es justo el fallo que este gate existe para evitar.
 *
 * @param {string[]} files
 */
const allowsEngines = (files) => ({
  files,
  rules: { 'no-restricted-imports': restrictImports([NO_BARRELS]) },
});

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**', '.claude/**', 'goal-loop-kit/**'] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser },
      parserOptions: {
        projectService: { defaultProject: 'tsconfig.app.json' },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.app.json', './tsconfig.node.json'],
          noWarnOnMultipleProjects: true,
        },
      },
    },
    plugins: { import: importPlugin },
    rules: {
      'import/order': ['error', IMPORT_ORDER],
      'no-restricted-imports': restrictImports([NO_BARRELS, NO_ENGINES]),
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Los mensajes de error para desarrollo interpolan cifras; el formato de cara al usuario
      // pasa siempre por src/lib/format.ts.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // Perfil §8 sitúa los hooks en .ts, no en .tsx: react-hooks tiene que alcanzarlos.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // recommended lo deja en warn y los warnings no bloquean ningún gate del perfil §5.
      // Una dependencia mal declarada en la fase C deja animaciones colgadas (I5).
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  {
    files: ['src/**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
  },

  allowsEngines([
    'src/motion/**/*.{ts,tsx}',
    'src/three/**/*.{ts,tsx}',
    'src/scenes/**/*.{ts,tsx}',
  ]),

  {
    files: ['vite.config.ts', 'vitest.config.ts', 'tooling/**/*.{ts,js}', 'scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { projectService: false },
    },
    extends: [tseslint.configs.disableTypeChecked],
  },
);
