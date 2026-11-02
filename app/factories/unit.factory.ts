import type { UnitForm } from '~/types/unit.types';

export const initEmptyUnitForm = (): UnitForm => ({
	translations: {
		en: { name: '', namePlural: '' },
		pt: { name: '', namePlural: '' }
	},
	symbol: '',
	spaceBeforeSymbol: false,
	allowDecimal: false,
	kind: ''
});
