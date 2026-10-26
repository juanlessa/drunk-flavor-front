import type { UnitForm } from '~/types/unit.types';
import { languages } from '~/domain/shared/translations.constants';
import type { Translations } from '~/domain/shared/translations.types';
import type { CreateUnit, UpdateUnit } from '~/domain/unit/unit.dtos';
import type { Unit, UnitKind, UnitTranslation } from '~/domain/unit/unit.entity';

const copyTranslations = (source: Translations<UnitTranslation>) =>
	languages.reduce((acc, lang) => {
		acc[lang] = { ...source[lang] };
		return acc;
	}, {} as Translations<UnitTranslation>);

export const mapUnitToForm = (unit: Unit): UnitForm => ({
	translations: copyTranslations(unit.translations),
	symbol: unit.symbol ?? '',
	space_before_symbol: unit.space_before_symbol ?? false,
	allow_decimal: unit.allow_decimal,
	kind: unit.kind
});

export const mapFormToCreateUnit = (unitForm: UnitForm): CreateUnit => {
	const symbol = unitForm.symbol.trim();

	return {
		translations: copyTranslations(unitForm.translations),
		// The backend rejects an empty symbol, so "no symbol" is sent as an omitted field.
		symbol: symbol.length > 0 ? symbol : undefined,
		space_before_symbol: unitForm.space_before_symbol,
		allow_decimal: unitForm.allow_decimal,
		// The form is only submitted after validation, which rejects an unselected kind.
		kind: unitForm.kind as UnitKind
	};
};

export const mapFormToUpdateUnit = (id: string, unitForm: UnitForm): UpdateUnit => {
	const { symbol, ...rest } = mapFormToCreateUnit(unitForm);

	return {
		id,
		...rest,
		// On update an empty symbol must explicitly clear the stored one, so send `null`
		// instead of omitting it (an omitted field keeps the current value).
		symbol: symbol ?? null
	};
};
