export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	author: string;
	readTime: string;
	tags: string[];
	coverImage?: string;
	content: string;
}
