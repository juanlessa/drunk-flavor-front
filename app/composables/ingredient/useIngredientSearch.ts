import type { IngredientSearchState } from '~/types/ingredient.types';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import type { ListIngredientsOptions } from '~/domain/ingredient/ingredient.dtos';
import type { Language } from '~/domain/shared/translations.types';
import { buildTranslatedNameQuery } from '~/helpers/query.helpers';

const PAGE_SIZE = 20;

const initState = (locale: Language): IngredientSearchState => ({
	options: [],
	selected: [],
	filter: {
		query: { page: 1, limit: PAGE_SIZE, ...buildTranslatedNameQuery('', locale) },
		isLastPage: false,
		searchTerm: ''
	},
	loading: false
});

/**
 * Searches ingredients on the server, the same way the ingredients list does: the term matches the name in
 * any language, ignoring accents and case ("limao" finds "Limão" and "Lime"), and the results are sorted
 * by the name in the current language.
 *
 * `scope` keeps the state and the request of one search apart from another, so two lists on the same page
 * (the ingredients and the garnishes of a drink) can each search on their own.
 *
 * Every ingredient is searched unless `listOptions.inUse` is set, which narrows the search to the ingredients that
 * at least one drink uses (the bar, where an ingredient no drink uses would only lead to an empty result).
 */
export const useIngredientSearch = (
	scope = 'default',
	listOptions: ListIngredientsOptions = {}
) => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();
	const { t, locale } = useI18n();
	const state = useState<IngredientSearchState>(`IngredientSearch:${scope}`, () =>
		initState(locale.value)
	);

	const { data, error, status } = useAsyncData(
		`ingredientMultiselectSearch:${scope}`,
		() => $api.ingredients.list(state.value.filter.query, listOptions),
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
			title: t('organisms.ingredientsControlOverview.errorTitle'),
			message: t('organisms.ingredientsControlOverview.errorMessage')
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
	watch(locale, restartSearch);

	onBeforeUnmount(() => {
		state.value = initState(locale.value);
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
	const options = computed(() =>
		state.value.options.filter(
			(opt) => !state.value.selected.some((selectedItem) => selectedItem.id === opt.id)
		)
	);

	const loading = computed(() => state.value.loading);

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		const { query } = state.value.filter;
		state.value.filter = { ...state.value.filter, query: { ...query, page: query.page + 1 } };
	};

	const handleSelect = (newSelected: InputSelectOption) => {
		const newSelectedOption = state.value.options.find((opt) => opt.id === newSelected.value);
		if (!newSelectedOption) {
			return;
		}
		state.value.selected = [...state.value.selected, newSelectedOption];
	};

	const handleRemoveSelected = (selected: InputSelectOption) => {
		state.value.selected = state.value.selected.filter((sel) => sel.id !== selected.value);
	};

	const initSelected = (ingredients: IngredientSearchState['selected']) => {
		state.value.selected = [...ingredients];
	};

	/** Moves a selected ingredient to another position; out-of-range moves are ignored. */
	const moveSelected = (from: number, to: number) => {
		const list = [...state.value.selected];
		if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
		const [moved] = list.splice(from, 1);
		list.splice(to, 0, moved!);
		state.value.selected = list;
	};

	return {
		moveSelected,
		loading,
		options,
		selected,
		searchTerm,
		handleSelect,
		handleRemoveSelected,
		initSelected,
		loadNextPage
	};
};
