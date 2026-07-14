import type { IngredientSearchState } from '~/types/ingredient';
import type { InputSelectOption } from '~/types/InputSelect';
import type { QueryParams } from '~/types/query';

const initState = (): IngredientSearchState => ({
	options: [],
	selected: [],
	filter: {
		query: { page: 1, limit: 10, search: {} },
		isLastPage: false,
		searchTerm: ''
	},
	loading: false
});

type UpdateStateFilter = {
	query?: Partial<QueryParams>;
	isLastPage?: boolean;
	searchTerm?: string;
};

export const useIngredientSearch = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();
	const { locale } = useI18n();
	const state = useState<IngredientSearchState>('IngredientSearch', initState);

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
		'ingredientMultiselectSearch',
		() => $api.ingredients.list(state.value.filter.query),
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
		addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const resetState = () => {
		state.value = initState();
	};

	onBeforeUnmount(() => resetState());

	watch(locale, (newLocale) => {
		state.value.options = [];
		state.value.filter = updateStateFilter({
			query: { page: 1, search: { [`translations.${newLocale}.name`]: '' } },
			isLastPage: false,
			searchTerm: ''
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
					query: { page: 1, search: { [`translations.${locale.value}.name`]: newTerm } },
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
	const options = computed(() =>
		state.value.options.filter(
			(opt) => !state.value.selected.some((selectedItem) => selectedItem._id === opt._id)
		)
	);

	const loading = computed(() => state.value.loading);

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		const { page } = state.value.filter.query;
		state.value.filter.query = updateStateFilterQuery({ page: page + 1 });
	};

	const handleSelect = (newSelected: InputSelectOption) => {
		const newSelectedOption = state.value.options.find((opt) => opt._id === newSelected.value);
		if (!newSelectedOption) {
			return;
		}
		state.value.selected = [...state.value.selected, newSelectedOption];
	};

	const handleRemoveSelected = (selected: InputSelectOption) => {
		state.value.selected = state.value.selected.filter((sel) => sel._id !== selected.value);
	};

	return {
		loading,
		options,
		selected,
		searchTerm,
		handleSelect,
		handleRemoveSelected,
		loadNextPage
	};
};
