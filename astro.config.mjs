// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://frankharkins.github.io',
	base: '/blog',
	integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      defaultColor: false,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      }
    }
  },
});
