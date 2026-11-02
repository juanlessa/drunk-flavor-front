import type { Category } from './category.entity';

export const initEmptyCategory = (): Category => ({
	id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	isAlcoholic: false,
	createdAt: new Date(),
	updatedAt: new Date()
});
