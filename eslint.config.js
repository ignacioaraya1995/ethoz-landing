// ESLint flat config — ESLint 9+
// Catches design-system + security regressions across .ts, .js, .svelte
import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default [
  // Ignore generated/built artifacts
  {
    ignores: [
      'node_modules/**',
      '.svelte-kit/**',
      'build/**',
      'static/**',
      'docs/**',
      'scripts/**',
      'supabase/.temp/**',
      '.firebase/**',
      '.omc/**',
      'src/lib/components/ui/**', // shadcn-svelte vendored — leave alone
      '*.config.js',
      '*.config.ts',
      // svelte-eslint-parser chokes on {@html `<script type="application/ld+json">...</script>`} blocks.
      // We use this pattern in 40+ +page.svelte files for SEO. The build (vite-plugin-svelte) handles it correctly,
      // so the runtime is fine — ESLint just can't parse those files. We rely on `npm run audit:security` for those.
      // ESLint still checks: src/lib/**, src/routes/admin/**, src/routes/api/**, .ts files everywhere, supabase/functions/**.
      'src/routes/**/+page.svelte',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...ts.configs.recommended,

  // Svelte rules
  ...svelte.configs['flat/recommended'],

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  // .svelte.ts files (Svelte 5 rune modules) — use TS parser
  {
    files: ['**/*.svelte.ts'],
    languageOptions: {
      parser: ts.parser,
    },
  },

  // Svelte-specific parser config (so .svelte files use TS in <script lang="ts">)
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  // ── Project rules: design-system + security guardrails ──
  {
    rules: {
      // Don't yell about TS unused vars in tests/migrations
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off', // we use `any` intentionally in a few places
      'no-undef': 'off', // TS handles this

      // Hard rules — catch the regressions we keep fighting
      'no-alert': 'error',          // No alert(), confirm(), prompt() — use shadcn Dialog/Sonner
      'no-debugger': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Svelte 5 specifics
      'svelte/no-at-html-tags': 'off', // we use {@html} for ld+json (controlled, safe)
      'svelte/valid-compile': ['error', { ignoreWarnings: false }], // catches <svelte:component> deprecation
      'svelte/no-target-blank': ['error', { allowReferrer: true, enforceDynamicLinks: 'always' }],
      'svelte/no-useless-mustaches': 'warn',
      'svelte/prefer-class-directive': 'off', // too noisy
      'svelte/require-each-key': 'warn',
      'svelte/no-navigation-without-resolve': 'off', // SvelteKit 2 rule, not applicable to our static patterns
      'svelte/prefer-svelte-reactivity': 'off', // Set/Map used non-reactively for tracking — not all instances need SvelteSet/SvelteMap
      'svelte/no-unused-svelte-ignore': 'warn', // downgrade to warn
    },
  },

  // ── Stricter rules for Svelte components only ──
  {
    files: ['**/*.svelte'],
    rules: {
      // Custom-feeling rules via no-restricted-syntax
      'no-restricted-syntax': [
        'error',
        // Block hardcoded Tailwind palette colors in class strings (matches text-red-500, bg-green-50, etc.)
        // Note: this catches the most common offenders. Brand color #25D366 (WhatsApp) is allowed because it uses brackets.
        {
          selector:
            'Literal[value=/(^|\\s)(text|bg|border|ring|fill|stroke|from|via|to|outline|divide)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|stone|neutral|zinc|gray|slate)-\\d+/]',
          message:
            'No hardcoded Tailwind palette colors. Use design tokens like text-primary, bg-success/10, border-destructive/20. See .impeccable.md.',
        },
        // Block dark: prefix (light-mode-only site)
        {
          selector: 'Literal[value=/(^|\\s)dark:/]',
          message: 'No dark: prefix — Ethoz is light-mode only. Remove dark variants.',
        },
      ],
    },
  },

  // ── Even stricter rules for admin pages ──
  {
    files: ['src/routes/admin/**/*.svelte'],
    rules: {
      'no-restricted-syntax': [
        'error',
        // Inherit the design-token rules
        {
          selector:
            'Literal[value=/(^|\\s)(text|bg|border|ring|fill|stroke|from|via|to|outline|divide)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|stone|neutral|zinc|gray|slate)-\\d+/]',
          message: 'No hardcoded Tailwind palette colors. Use design tokens.',
        },
        {
          selector: 'Literal[value=/(^|\\s)dark:/]',
          message: 'No dark: prefix — light-mode only.',
        },
      ],
    },
  },

  // ── Security rules for client-side TS — localStorage warnings (not errors) ──
  {
    files: ['src/**/*.ts', 'src/**/*.svelte'],
    ignores: ['**/*.test.ts', 'src/lib/utils/internal.ts', 'src/lib/utils/visitor.ts', 'src/routes/+layout.svelte'],
    rules: {
      'no-restricted-properties': [
        'warn',
        {
          object: 'localStorage',
          property: 'setItem',
          message: 'Avoid localStorage for PII, tokens, or secrets. Use sessionStorage for temporary data and Supabase for persistent.',
        },
      ],
    },
  },

  // ── Edge Functions (Deno) — different env ──
  {
    files: ['supabase/functions/**/*.ts'],
    languageOptions: {
      globals: { Deno: 'readonly', ...globals.browser },
    },
    rules: {
      'no-console': 'off', // Edge Functions log to console intentionally
      // Block OAuth client_secret in URL params
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TemplateLiteral[quasis.0.value.raw=/[?&]client_secret=/]',
          message: 'Never put client_secret in URL params. Move to POST body (form-urlencoded).',
        },
      ],
    },
  },
];
