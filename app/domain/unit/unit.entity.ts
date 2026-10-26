import type { DatabaseCommonInfo } from '../shared/database.types';
import type { Translations } from '../shared/translations.types';
import type { UnitKinds } from './unit.constants';

export type UnitKind = (typeof UnitKinds)[keyof typeof UnitKinds];

export type UnitTranslation = {
	name: string;
	name_plural: string;
};

/**
 * Unit =
 *     _id: string
 *     translations: Translations<UnitTranslation> ({ name, name_plural } per language)
 *     symbol?: string (locale-independent display symbol, e.g. "ml", "g")
 *     space_before_symbol?: boolean (render "5 ml" instead of "5ml")
 *     allow_decimal: boolean (whether quantities may be fractional)
 *     kind: UnitKind ("volume" | "mass" | "count" | "informal")
 *     created_at: Date
 *     updated_at: Date
 */
export type Unit = DatabaseCommonInfo & {
	translations: Translations<UnitTranslation>;
	symbol?: string;
	space_before_symbol?: boolean;
	allow_decimal: boolean;
	kind: UnitKind;
};
