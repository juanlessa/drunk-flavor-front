// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			apiBase: "",
		},
	},
	css: ["@/styles/global.css"],
	modules: ["@vueuse/nuxt"],
});
