import type { Drink } from '~/domain/drink/drink.entity';
import { getMissingRequiredIngredientIds } from '~/helpers/drinkMatch.helpers';
import { getBaseRouteName } from '~/helpers/route.helpers';

const BAR_ROUTE_NAME = 'bar';

/**
 * The ingredients of a drink missing from the person's bar, only when the drink was opened from the bar page;
 * `undefined` anywhere else, so the page shows the plain recipe. Worked out from the bar kept in the browser,
 * with the rule the bar's match uses, so it says the same as the card that led here.
 *
 * Where the person came from is the previous in-app page, which vue-router keeps in the history state: it
 * survives a reload and the browser's back and forward buttons, and it is never part of the URL, so a shared
 * link opens the plain recipe. Neither the history nor the bar exists on the server, so the page renders the
 * plain recipe there and while hydrating, and the missing ingredients appear once it is mounted.
 */
export const useBarMissingIngredients = (drink: MaybeRefOrGetter<Drink | null | undefined>) => {
	const router = useRouter();
	const { ingredientIds } = useMyBar();
	const cameFromBar = ref(false);

	onMounted(() => {
		const back: unknown = window.history.state?.back;
		cameFromBar.value =
			typeof back === 'string' &&
			getBaseRouteName(router.resolve(back).name) === BAR_ROUTE_NAME;
	});

	return computed<string[] | undefined>(() => {
		const current = toValue(drink);
		// An emptied bar has nothing to compare with: every ingredient would be "missing".
		if (!cameFromBar.value || !current || ingredientIds.value.length === 0) return undefined;
		return getMissingRequiredIngredientIds(current, ingredientIds.value);
	});
};
