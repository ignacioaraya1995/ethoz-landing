import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const mockRoot = fileURLToPath(new URL('./src/tests/mocks', import.meta.url));
const libRoot = fileURLToPath(new URL('./src/lib', import.meta.url));

function svelteKitMocksPlugin(): Plugin {
	const mocks: Record<string, string> = {
		'$app/environment': path.join(mockRoot, 'app-environment.ts'),
		'$env/dynamic/public': path.join(mockRoot, 'env-dynamic-public.ts'),
	};
	return {
		name: 'sveltekit-mocks',
		enforce: 'pre',
		resolveId(id) {
			if (mocks[id]) return mocks[id];
			if (id.startsWith('$lib')) return id.replace('$lib', libRoot);
			return undefined;
		},
	};
}

export default defineConfig(({ mode }) => ({
	plugins: mode === 'test'
		? [svelteKitMocksPlugin(), svelte({ preprocess: vitePreprocess() })]
		: [tailwindcss(), sveltekit()],
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'jsdom',
		alias: [
			{ find: '$app/environment', replacement: path.join(mockRoot, 'app-environment.ts') },
			{ find: '$env/dynamic/public', replacement: path.join(mockRoot, 'env-dynamic-public.ts') },
			{ find: /^\$lib\/(.*)/, replacement: path.join(libRoot, '$1') },
			{ find: '$lib', replacement: libRoot },
		],
	},
}));
