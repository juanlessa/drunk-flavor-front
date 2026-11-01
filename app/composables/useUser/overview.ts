import { watchDebounced } from '@vueuse/core';
import { INTERACTION_TIMING_MS } from '~/constants/durations.constants';
import type { UsersOverviewState } from '~/types/user.types';

const initState = (): UsersOverviewState => ({
	users: [],
	filter: {
		page: 1,
		limit: 30,
		isLastPage: false,
		sort: { email: 1 }
	},
	searchTerm: '',
	loading: false
});

export const useUsersOverview = () => {
	const { $api } = useNuxtApp();
	const { t } = useI18n();
	const { addToast } = useToast();
	const state = useState<UsersOverviewState>('usersOverview', initState);

	const { data, error, status } = useAsyncData(
		'usersOverview',
		() =>
			$api.users.list({
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
		state.value.users = [...state.value.users, ...newData];
	});

	watch(error, (newError) => {
		if (!newError) return;
		console.error(newError);
		addToast({
			type: 'error',
			title: t('organisms.usersControlOverview.errorTitle'),
			message: t('organisms.usersControlOverview.errorMessage')
		});
	});

	watch(status, (newStatus) => {
		state.value.loading = newStatus === 'pending';
	});

	// The backend only searches by email; an empty term lists every user again.
	watchDebounced(
		() => state.value.searchTerm,
		(term) => {
			const email = term.trim();
			state.value.users = [];
			state.value.filter = {
				...state.value.filter,
				page: 1,
				isLastPage: false,
				search: email ? { email } : undefined
			};
		},
		{ debounce: INTERACTION_TIMING_MS.searchDebounce }
	);

	const resetOverviewState = () => {
		state.value = initState();
	};
	onBeforeUnmount(() => resetOverviewState());

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
		() => !state.value.loading && state.value.filter.isLastPage && !state.value.users.length
	);

	return {
		overviewState: state,
		searchTerm,
		isEmpty,
		resetOverviewState,
		loadNextPage
	};
};
