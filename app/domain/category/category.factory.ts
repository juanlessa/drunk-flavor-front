import type { Category } from './category.entity';

export const initEmptyCategory = (): Category => ({
	_id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	is_alcoholic: false,
	created_at: new Date(),
	updated_at: new Date()
});
