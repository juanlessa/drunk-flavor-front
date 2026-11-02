import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import type { Language } from '~/domain/shared/translations.types';
import { buildTranslatedNameQuery } from '~/helpers/query.helpers';
import type { UnitsOverviewState } from '~/types/unit.types';

const initState = (locale: Language): UnitsOverviewState => ({
	units: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false,
		...buildTranslatedNameQuery('', locale)
	},
	searchTerm: '',
	loading: false
});

export const useUnitsOverview = () => {
	const { $api } = useNuxtApp();
	const { t, locale } = useI18n();
	const { addToast } = useToast();

	const state = useState<UnitsOverviewState>('unitsOverview', () => initState(locale.value));

	const { data, error, status } = useAsyncData(
		'unitsOverview',
		() =>
			$api.units.list({
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
		state.value.units = [...state.value.units, ...newData];
	});
	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t('organisms.unitsControlOverview.errorTitle'),
			message: t('organisms.unitsControlOverview.errorMessage')
		});
	});
	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	const restartList = () => {
		state.value.units = [];
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

	const deleteUnit = async (unitId: string) => {
		await $api.units.delete(unitId);
		state.value.units = state.value.units.filter(({ id }) => id !== unitId);
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
		() => !state.value.loading && state.value.filter.isLastPage && !state.value.units.length
	);

	return {
		overviewState: state,
		searchTerm,
		isEmpty,
		resetOverviewState,
		deleteUnit,
		loadNextPage
	};
};
