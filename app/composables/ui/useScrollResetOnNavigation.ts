import { watch, type Ref } from 'vue';
import { getLocaleAgnosticPageKey } from '~/helpers/route.helpers';
/**
 * Scrolls the layout's content area back to the top when the user goes to another page.
 *
 * The browser only resets the window on navigation, and the layouts scroll an inner element.
 * A language switch keeps the page (see `getLocaleAgnosticPageKey`), so it keeps the position too.
 */
export const useScrollResetOnNavigation = (scroller: Ref<HTMLElement | null>) => {
	const route = useRoute();
	watch(
		() => getLocaleAgnosticPageKey(route),
		() => scroller.value?.scrollTo({ top: 0 })
	);
};
