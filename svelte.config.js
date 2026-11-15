import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// The site deploys to Vercel. Use its adapter directly rather than adapter-auto,
		// which installs an old adapter-vercel at build time that rejects current Node versions.
		adapter: adapter()
	}
};

export default config;
