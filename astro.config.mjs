// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'static', // ✅ SSG горим
	vite: {
		build: {
			rollupOptions: {
				external: ['graphql-request']
			}
		}
	},
	site: 'https://www.centuryhousegardens.com/',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !page.includes('/private') && !page.includes('/admin')
		})
	],
});
