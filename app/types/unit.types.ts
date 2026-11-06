import type { PaginatedOverviewState } from '~/types/overview.types';
import type { Translations } from '~/domain/shared/translations.types';
import type { FieldError } from '~/types/form.types';
import type { SearchSelectState } from '~/types/searchSelect.types';
import type { Unit, UnitKind, UnitTranslation } from '~/domain/unit/unit.entity';

export type UnitsOverviewState = PaginatedOverviewState<'units', Unit>;

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

export type UnitSearchSelectState = SearchSelectState<Unit>;
