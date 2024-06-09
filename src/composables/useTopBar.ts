import type { TopBarState } from '~/types/TopBar';

const initState = (): TopBarState => ({ links: [] });

export const useTopBar = () => {
	const topBarState = useState<TopBarState>('topBar', initState);

	const getTopBarState = () => topBarState;

	const loadRoutes = () => {
		topBarState.value.links = [
			{
				i18nKey: 'organisms.topBar.categories',
				path: '/categories'
			},
			{
				i18nKey: 'organisms.topBar.ingredients',
				path: '/ingredients'
			},
			{
				i18nKey: 'organisms.topBar.drinks',
				path: '/drinks'
			}
		];
	};

	return {
		getTopBarState,
		loadRoutes
	};
};
