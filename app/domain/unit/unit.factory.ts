import { UnitKinds } from './unit.constants';
import type { Unit } from './unit.entity';

export const initEmptyUnit = (): Unit => ({
	id: '',
	translations: {
		en: { name: '', namePlural: '' },
		pt: { name: '', namePlural: '' }
	},
	symbol: undefined,
	spaceBeforeSymbol: false,
	allowDecimal: false,
	kind: UnitKinds.volume,
	createdAt: new Date(),
	updatedAt: new Date()
});
