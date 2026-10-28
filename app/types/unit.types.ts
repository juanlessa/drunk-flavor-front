import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from '~/types/form.types';
import type { Filter } from '~/domain/shared/filters.types';
import type { QueryParams } from '~/domain/shared/query.types';
import type { Unit, UnitKind, UnitTranslation } from '~/domain/unit/unit.entity';

export type UnitsOverviewState = {
	units: Unit[];
	filter: Filter;
	loading: boolean;
};

export type UnitForm = {
	translations: Translations<UnitTranslation>;
	// An empty string means "no symbol"; the mapper omits it from the request.
	symbol: string;
	spaceBeforeSymbol: boolean;
	allowDecimal: boolean;
	// An empty string means "not selected yet"; validation rejects it.
	kind: UnitKind | '';
};

export type UnitFormState = {
	form: UnitForm;
	errors: FieldError[];
	displayErrors: boolean;
};

export type UnitSearchSelectState = {
	options: Unit[];
	selected: InputSelectOption;
	filter: {
		query: QueryParams;
		isLastPage: boolean;
		searchTerm: string;
	};
	loading: boolean;
};
