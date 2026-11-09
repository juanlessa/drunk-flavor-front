import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import { buildTranslatedNameQuery } from '~/helpers/query.helpers';
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

const PAGE_SIZE = 10;

const initState = <T>(locale: Language): SearchSelectState<T> => ({
	options: [],
	selected: { label: '', value: '' },
	filter: {
		query: { page: 1, limit: PAGE_SIZE, ...buildTranslatedNameQuery('', locale) },
		isLastPage: false,
		searchTerm: ''
	},
	loading: false
});

/**
 * Options, search term and selection of a searchable select that loads more options on scroll.
 *
 * The search is made on the server, like the management lists: the term matches the name in any
 * language, ignoring accents and case, and the options come sorted by the name in the current
 * language. It starts after a pause in typing; changing the language starts one for the
 * selected option's name in the new language.
 */
export const useSearchableSelect = <T extends SearchableEntity>(
	options: UseSearchableSelectOptions<T>
) => {
	const { t, locale } = useI18n();
	const { addToast } = useToast();
	const state = useState<SearchSelectState<T>>(options.stateKey, () =>
		initState<T>(locale.value)
	);

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
		if (newData.length < state.value.filter.query.limit) {
			state.value.filter.isLastPage = true;
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

	const restartSearch = () => {
		state.value.options = [];
		state.value.filter = {
			...state.value.filter,
			query: {
				page: 1,
				limit: PAGE_SIZE,
				...buildTranslatedNameQuery(state.value.filter.searchTerm.trim(), locale.value)
			},
			isLastPage: false
		};
	};

	watchDebounced(() => state.value.filter.searchTerm, restartSearch, {
		debounce: INTERACTION_TIMING_MS.searchDebounce
	});

	onBeforeUnmount(() => {
		state.value = initState<T>(locale.value);
	});

	watch(locale, (newLocale) => {
		const selectedOption = state.value.options.find(
			(opt) => opt.id === state.value.selected.value
		);
		const name = selectedOption?.translations[newLocale as Language]?.name || '';
		state.value.selected = { label: name, value: state.value.selected.value };
		state.value.filter.searchTerm = name;
		restartSearch();
	});

	const searchTerm = computed({
		get: () => state.value.filter.searchTerm,
		set: (newTerm) => {
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
		const { query } = state.value.filter;
		state.value.filter = { ...state.value.filter, query: { ...query, page: query.page + 1 } };
	};

	return {
		loading,
		options: optionsList,
		searchTerm,
		selected,
		loadNextPage
	};
};
