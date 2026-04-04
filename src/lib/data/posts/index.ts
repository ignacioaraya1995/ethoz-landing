export type { BlogPost } from './types';

// Import all posts
const modules = import.meta.glob('./*.ts', { eager: true }) as Record<string, { post: import('./types').BlogPost }>;

// Collect and sort by date (newest first)
export const allPosts = Object.entries(modules)
	.filter(([path]) => path !== './types.ts' && path !== './index.ts')
	.map(([, mod]) => mod.post)
	.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
