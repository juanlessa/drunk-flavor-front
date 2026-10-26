import { UnitKinds } from './unit.constants';
import type { Unit } from './unit.entity';

export const initEmptyUnit = (): Unit => ({
	_id: '',
	translations: {
		en: { name: '', name_plural: '' },
		pt: { name: '', name_plural: '' }
	},
	symbol: undefined,
	space_before_symbol: false,
	allow_decimal: false,
	kind: UnitKinds.volume,
	created_at: new Date(),
	updated_at: new Date()
});
