import type { Translations } from '../shared/translations.types';
import type { UnitKind, UnitTranslation } from './unit.entity';

export type CreateUnit = {
	translations: Translations<UnitTranslation>;
	symbol?: string;
	spaceBeforeSymbol?: boolean;
	allowDecimal: boolean;
	kind: UnitKind;
};

export type UpdateUnit = Omit<CreateUnit, 'symbol'> & {
	id: string;
	/** `null` removes the symbol; the backend rejects an empty string. */
	symbol: string | null;
};
