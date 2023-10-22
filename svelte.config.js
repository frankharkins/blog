import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md']
    })
  ],

  extensions: ['.svelte', '.md'],

	kit: {
    adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
    paths: {
      base: (process.argv.includes('dev') ? '' : "/frankharkins.github.io")  + "/blog"
    },
    prerender: {
      handleHttpError: ({ path, _referrer, message }) => {
        if (path === '/frankharkins.github.io/') { return }
        throw new Error(message)
      }
    }
	}
};

export default config;
