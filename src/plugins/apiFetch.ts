import { CategoriesRepository } from '~/repositories/Categories.repository';

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const apiFecther = $fetch.create({
		baseURL: config.public.apiBase,
		credentials: 'include'
	});

	const modules = {
		categories: new CategoriesRepository(apiFecther)
	};

	return {
		provide: {
			api: modules
		}
	};
});
