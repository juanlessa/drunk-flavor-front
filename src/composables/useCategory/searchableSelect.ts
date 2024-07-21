import type { CategorySearchSelectState } from '~/types/category';
import type { QueryParams } from '~/types/query';
import type { Language } from '~/types/translations';

const initState = (): CategorySearchSelectState => ({
	options: [],
	selected: { label: '', value: '' },
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

export const useCategorySearchableSelect = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();
	const { locale } = useI18n();
	const state = useState<CategorySearchSelectState>('categorySearchSelect', initState);

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
		'categoriesOverview',
		() => $api.categories.list(state.value.filter.query),
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
		const selectedCategory = state.value.options.find(
			(opt) => opt._id === state.value.selected.value
		);
		const name = selectedCategory?.translations[newLocale as Language]?.name || '';
		const id = state.value.selected.value;

		state.value.selected = { label: name, value: id };
		state.value.options = [];
		state.value.filter = updateStateFilter({
			query: { page: 1, search: { [`translations.${newLocale}.name`]: name } },
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
	const options = computed(() => state.value.options);
	const loading = computed(() => state.value.loading);

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		const { page } = state.value.filter.query;
		state.value.filter.query = updateStateFilterQuery({ page: page + 1 });
	};

	return {
		loading,
		options,
		searchTerm,
		selected,
		loadNextPage
	};
};
