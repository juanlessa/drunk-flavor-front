import type { TopBarState } from '~/types/TopBar';

const initState = (): TopBarState => ({ links: [] });

export const useTopBar = () => {
	const topBarState = useState<TopBarState>('topBar', initState);

	const getTopBarState = () => topBarState;

	const loadRoutes = () => {
		topBarState.value.links = [
			{
				i18nKey: 'navbar.categories',
				path: '/categories'
			},
			{
				i18nKey: 'navbar.ingredients',
				path: '/ingredients'
			},
			{
				i18nKey: 'navbar.drinks',
				path: '/drinks'
			}
		];
	};

	return {
		getTopBarState,
		loadRoutes
	};
};
