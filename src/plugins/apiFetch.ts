export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	const apiFetch = $fetch.create({
		baseURL: config.public.apiBase,
		credentials: 'include'
	});

	nuxtApp.provide('apiFetch', apiFetch);
});
