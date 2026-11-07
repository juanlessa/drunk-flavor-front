import type { Language, Translations } from '~/domain/shared/translations.types';
import type { QueryParams } from '~/domain/shared/query.types';
import type { SearchSelectState } from '~/types/searchSelect.types';

/** An entity that can be searched and labelled by its localized name. */
type SearchableEntity = {
	id: string;
	translations: Translations<{ name: string }>;
};

export type UseSearchableSelectOptions<T extends SearchableEntity> = {
	/** `useState` key of the select state. */
	stateKey: string;
	/** `useAsyncData` key of the options request. */
	asyncDataKey: string;
	/** Fetches one page of options. */
	list: (query: QueryParams) => Promise<T[]>;
	/** Prefix of the i18n keys `errorTitle` and `errorMessage`, shown when the fetch fails. */
	errorI18nPrefix: string;
};

type UpdateStateFilter = {
	query?: Partial<QueryParams>;
	isLastPage?: boolean;
	searchTerm?: string;
};

const initState = <T>(): SearchSelectState<T> => ({
	options: [],
	selected: { label: '', value: '' },
	filter: {
		query: { page: 1, limit: 10, search: {} },
		isLastPage: false,
		searchTerm: ''
	},
	loading: false
});

/**
 * Options, search term and selection of a searchable select that loads more options on scroll.
 *
 * Typing at least two characters (or clearing the field) starts a new search by the localized
 * name; changing the language starts one for the selected option's name in the new language.
 */
export const useSearchableSelect = <T extends SearchableEntity>(
	options: UseSearchableSelectOptions<T>
) => {
	const { t, locale } = useI18n();
	const { addToast } = useToast();

	const state = useState<SearchSelectState<T>>(options.stateKey, () => initState<T>());

	const updateStateFilterQuery = (query?: Partial<QueryParams>) => {
		return {
			limit: query?.limit || state.value.filter.query.limit,
			page: query?.page || state.value.filter.query.page,
			search: query?.search || state.value.filter.query.search,
			sort: query?.sort || state.value.filter.query.sort
		};
	};

	const updateStateFilter = ({ query, isLastPage, searchTerm }: UpdateStateFilter) => {
		return {
			query: updateStateFilterQuery(query),
			isLastPage: isLastPage || state.value.filter.isLastPage,
			searchTerm: searchTerm || state.value.filter.searchTerm
		};
	};

	const { data, error, status } = useAsyncData(
		options.asyncDataKey,
		() => options.list(state.value.filter.query),
		{
			server: false,
			lazy: true,
			watch: [() => state.value.filter.query]
		}
	);

	watch(data, (newData) => {
		if (!newData) return;
		if (newData.length === 0) {
			state.value.filter.isLastPage = true;
			return;
		}
		state.value.options = [...state.value.options, ...newData];
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t(`${options.errorI18nPrefix}.errorTitle`),
			message: t(`${options.errorI18nPrefix}.errorMessage`)
		});
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const resetState = () => {
		state.value = initState<T>();
	};

	onBeforeUnmount(() => resetState());

	watch(locale, (newLocale) => {
		const selectedOption = state.value.options.find(
			(opt) => opt.id === state.value.selected.value
		);
		const name = selectedOption?.translations[newLocale as Language]?.name || '';
		const id = state.value.selected.value;
		state.value.selected = { label: name, value: id };
		state.value.options = [];
		state.value.filter = updateStateFilter({
			query: { page: 1, search: { name } },
			isLastPage: false,
			searchTerm: name
		});
	});

	const shouldResetFilters = (newTerm: string, currentTerm: string) =>
		(newTerm.length >= 2 && newTerm.slice(0, 2) !== currentTerm.slice(0, 2)) ||
		newTerm.length === 0;

	const searchTerm = computed({
		get: () => state.value.filter.searchTerm,
		set: (newTerm) => {
			const currentTerm = state.value.filter.searchTerm;
			if (shouldResetFilters(newTerm, currentTerm)) {
				state.value.options = [];
				state.value.filter = updateStateFilter({
					query: { page: 1, search: { name: newTerm } },
					isLastPage: false,
					searchTerm: newTerm
				});
				return;
			}
			state.value.filter.searchTerm = newTerm;
		}
	});

	const selected = computed({
		get: () => state.value.selected,
		set: (newSelected) => (state.value.selected = newSelected)
	});

	const optionsList = computed(() => state.value.options);
	const loading = computed(() => state.value.loading);

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		const { page } = state.value.filter.query;
		state.value.filter.query = updateStateFilterQuery({ page: page + 1 });
	};

	return {
		loading,
		options: optionsList,
		searchTerm,
		selected,
		loadNextPage
	};
};
