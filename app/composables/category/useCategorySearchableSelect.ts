import type { Category } from '~/domain/category/category.entity';

export const useCategorySearchableSelect = () => {
	const { $api } = useNuxtApp();

	return useSearchableSelect<Category>({
		stateKey: 'categorySearchSelect',
		asyncDataKey: 'categorySearchableSelect',
		list: (query) => $api.categories.list(query),
		errorI18nPrefix: 'organisms.categoriesControlOverview'
	});
};
