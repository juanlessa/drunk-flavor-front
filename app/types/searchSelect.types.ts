import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import type { QueryParams } from '~/domain/shared/query.types';

/** State of a select whose options are fetched page by page as the user searches. */
export type SearchSelectState<T> = {
	options: T[];
	selected: InputSelectOption;
	filter: {
		query: QueryParams;
		isLastPage: boolean;
		searchTerm: string;
	};
	loading: boolean;
};
