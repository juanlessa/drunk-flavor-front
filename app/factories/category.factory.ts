import type { CategoryForm } from '~/types/category.types';

export const initEmptyCategoryForm = (): CategoryForm => ({
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	isAlcoholic: false
});
