import type { UnitForm } from '~/types/unit.types';

export const initEmptyUnitForm = (): UnitForm => ({
	translations: {
		en: { name: '', name_plural: '' },
		pt: { name: '', name_plural: '' }
	},
	symbol: '',
	space_before_symbol: false,
	allow_decimal: false,
	kind: ''
});
