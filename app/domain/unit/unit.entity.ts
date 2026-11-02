import type { EntityMetadata } from '../shared/entity.types';
import type { Translations } from '../shared/translations.types';
import type { UnitKinds } from './unit.constants';

export type UnitKind = (typeof UnitKinds)[keyof typeof UnitKinds];
export type UnitTranslation = { name: string; namePlural: string };

export type Unit = EntityMetadata & {
	translations: Translations<UnitTranslation>;
	symbol?: string;
	spaceBeforeSymbol?: boolean;
	allowDecimal: boolean;
	kind: UnitKind;
};
