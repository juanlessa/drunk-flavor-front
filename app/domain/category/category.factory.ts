import type { Category } from './category.entity';

export const initEmptyCategory = (): Category => ({
	_id: '',
	translations: {
		en: { name: '' },
		pt: { name: '' }
	},
	created_at: new Date(),
	updated_at: new Date()
});
