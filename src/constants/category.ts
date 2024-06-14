import type { ICategory, CategoryForm } from '@/types/category';

export const initEmptyCategory = (): ICategory => ({
	_id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	created_at: new Date(),
	updated_at: new Date()
});

export const initEmptyCategoryForm = (): CategoryForm => ({
	translations: {
		en: { name: '' },
		pt: { name: '' }
	}
});
