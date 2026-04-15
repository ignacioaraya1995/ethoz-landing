/**
 * Lighthouse CI config — Ethoz landing.
 * Runs against locally served preview build for canonical public pages.
 *
 * Usage (requires preview server on :4173):
 *   npm run build && npm run preview -- --port 4173 &
 *   npx lhci autorun --config=./.lighthouserc.cjs
 *
 * Use `npm run lighthouse` to wrap the full flow once wired to package.json.
 */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/productos',
        'http://localhost:4173/compliance',
        'http://localhost:4173/get-started',
        'http://localhost:4173/blog',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Core Web Vitals budgets
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Specific audits
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],

        // Resource budgets — landing is marketing, heavier hero images accepted
        'resource-summary:script:size': ['warn', { maxNumericValue: 500000 }],
        'resource-summary:total:size': ['warn', { maxNumericValue: 2500000 }],

        // Best-practice hardening
        'uses-text-compression': 'error',
        'uses-responsive-images': 'warn',
        'render-blocking-resources': ['warn', { maxLength: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
