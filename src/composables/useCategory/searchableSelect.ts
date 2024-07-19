import type { CategorySearchSelectState } from '~/types/category';
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

export const useCategorySearchableSelect = () => {
	const { $api } = useNuxtApp();
	const { addToast } = useToast();
	const { locale } = useI18n();

	const state = useState<CategorySearchSelectState>('categorySearchSelect', initState);

	const { data, error, status } = useAsyncData(
		'categoriesOverview',
		() => $api.categories.getCategories(state.value.filter.query),
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
		console.log('new data');
		console.log(newData);
		console.log(state.value.options);

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
		console.log('changed locale');
		let localeName = '';
		if (state.value.selected.value) {
			const selected = state.value.options.find(
				(opt) => opt._id === state.value.selected.value
			);
			if (selected) {
				localeName = selected.translations[newLocale as Language].name;
			}
		}

		state.value.selected = { label: localeName, value: state.value.selected.value };
		state.value.options = [];
		state.value.filter = {
			query: {
				limit: state.value.filter.query.limit,
				page: 1,
				search: {
					[`translations.${newLocale}.name`]: localeName
				}
			},
			isLastPage: false,
			searchTerm: localeName
		};
	});

	const shouldResetFilters = (newTerm: string, currentTerm: string) =>
		(newTerm.length >= 2 && newTerm.slice(0, 2) !== currentTerm.slice(0, 2)) ||
		newTerm.length === 0;

	const searchTerm = computed({
		get: () => state.value.filter.searchTerm,
		set: (newTerm) => {
			console.log('set search term');

			const currentTerm = state.value.filter.searchTerm;
			if (shouldResetFilters(newTerm, currentTerm)) {
				console.log('update filters');
				state.value.options = [];
				state.value.filter = {
					query: {
						limit: state.value.filter.query.limit,
						page: 1,
						search: {
							[`translations.${locale.value}.name`]: newTerm
						}
					},
					isLastPage: false,
					searchTerm: newTerm
				};
				console.log(state.value);
				return;
			}
			state.value.filter.searchTerm = newTerm;
			console.log(state.value);
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
		state.value.filter.query = {
			...state.value.filter.query,
			page: state.value.filter.query.page + 1
		};
	};

	return {
		loading,
		options,
		searchTerm,
		selected,
		loadNextPage
	};
};
