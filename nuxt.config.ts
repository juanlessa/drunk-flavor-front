// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ['~/styles/global.css'],

	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {}
		}
	},
	modules: ['@nuxt/test-utils/module', '@nuxt/eslint']
});
