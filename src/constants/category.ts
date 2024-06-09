import type { ICategory, ICategoryForm } from '@/types/category';

export const initEmptyCategory = (): ICategory => ({
	_id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	created_at: new Date(),
	updated_at: new Date()
});

export const initEmptyCategoryForm = (): ICategoryForm => ({
	translations: {
		en: { name: '' },
		pt: { name: '' }
	}
});
