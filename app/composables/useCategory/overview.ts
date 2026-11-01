import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import type { Language } from '~/domain/shared/translations.types';
import { buildTranslatedNameQuery } from '~/helpers/query.helpers';
import type { CategoriesOverviewState } from '~/types/category.types';

const initState = (locale: Language): CategoriesOverviewState => ({
	categories: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false,
		...buildTranslatedNameQuery('', locale)
	},
	searchTerm: '',
	loading: false
});

export const useCategoriesOverview = () => {
	const { $api } = useNuxtApp();
	const { t, locale } = useI18n();
	const { addToast } = useToast();

	const state = useState<CategoriesOverviewState>('categoriesOverview', () =>
		initState(locale.value)
	);

	const { data, error, status } = useAsyncData(
		'categoriesOverview',
		() =>
			$api.categories.list({
				limit: state.value.filter.limit,
				page: state.value.filter.page,
				search: state.value.filter.search,
				sort: state.value.filter.sort
			}),
		{
			server: false,
			lazy: true,
			watch: [() => state.value.filter]
		}
	);

	watch(data, (newData) => {
		if (!newData) return;
		if (newData.length < state.value.filter.limit) {
			state.value.filter.isLastPage = true;
		}
		state.value.categories = [...state.value.categories, ...newData];
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t('organisms.categoriesControlOverview.errorTitle'),
			message: t('organisms.categoriesControlOverview.errorMessage')
		});
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const restartList = () => {
		state.value.categories = [];
		state.value.filter = {
			...state.value.filter,
			...buildTranslatedNameQuery(state.value.searchTerm.trim(), locale.value),
			page: 1,
			isLastPage: false
		};
	};

	watchDebounced(() => state.value.searchTerm, restartList, {
		debounce: INTERACTION_TIMING_MS.searchDebounce
	});
	watch(locale, restartList);

	const resetOverviewState = () => {
		state.value = initState(locale.value);
	};

	onBeforeUnmount(() => resetOverviewState());

	const deleteCategory = async (categoryId: string) => {
		await $api.categories.delete(categoryId);
		state.value.categories = state.value.categories.filter(({ id }) => id !== categoryId);
	};

	const loadNextPage = () => {
		if (state.value.loading || state.value.filter.isLastPage) return;
		state.value.filter = { ...state.value.filter, page: state.value.filter.page + 1 };
	};

	const searchTerm = computed({
		get: () => state.value.searchTerm,
		set: (term: string) => {
			state.value.searchTerm = term;
		}
	});

	const isEmpty = computed(
		() =>
			!state.value.loading && state.value.filter.isLastPage && !state.value.categories.length
	);

	return {
		overviewState: state,
		searchTerm,
		isEmpty,
		resetOverviewState,
		deleteCategory,
		loadNextPage
	};
};
