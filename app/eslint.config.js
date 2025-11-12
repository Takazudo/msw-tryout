import globals from 'globals';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const nextPlugin = require('@next/eslint-plugin-next');

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Main configuration for source files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ignores: [
      'dist/**',
      'node_modules/**',
      '.git/**',
      '.next/**',
      'next-env.d.ts',
      'coverage/**',
      'playwright.config.ts',
      'tests/**',
      '__inbox/**',
      'out/**',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, process: 'readonly' },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '19.0' } },
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': nextPlugin,
      react: eslintReact,
      'react-hooks': eslintReactHooks,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...eslintReact.configs.recommended.rules,
      ...eslintReact.configs['jsx-runtime'].rules,
      ...eslintReactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@next/next/no-img-element': 'off',
      'react-hooks/set-state-in-effect': 'warn', // Allow setState in effects with warning
      ...eslintConfigPrettier.rules,
    },
  },
  // Configuration for Next.js and Tailwind config files
  {
    files: ['next.config.js', 'tailwind.config.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off', // Node.js globals
      ...eslintConfigPrettier.rules,
    },
  },
  // Configuration for Playwright config and test files
  {
    files: ['playwright.config.ts', 'playwright.config.*.ts', 'tests/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      ...eslintConfigPrettier.rules,
    },
  },
];
