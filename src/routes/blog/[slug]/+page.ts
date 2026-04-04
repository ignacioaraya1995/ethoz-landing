import { error } from '@sveltejs/kit';
import { allPosts } from '$lib/data/posts';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const post = allPosts.find((p) => p.slug === params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
};

export function entries() {
	return allPosts.map((p) => ({ slug: p.slug }));
}
