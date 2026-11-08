import type { EntityMetadata } from '../shared/entity.types';
import type { Gender } from '../shared/gender.types';
import type { Translations } from '../shared/translations.types';
import type { UnitKinds } from './unit.constants';
export type UnitKind = (typeof UnitKinds)[keyof typeof UnitKinds];
export type UnitTranslation = {
	name: string;
	namePlural: string;
	/** Grammatical gender of the name in this language. The backend requires it in Portuguese. */
	gender?: Gender;
};
export type Unit = EntityMetadata & {
	translations: Translations<UnitTranslation>;
	symbol?: string;
	spaceBeforeSymbol?: boolean;
	allowDecimal: boolean;
	kind: UnitKind;
};
