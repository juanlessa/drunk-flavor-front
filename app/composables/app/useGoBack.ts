/**
 * Goes back to the page the person came from, so a drink opened from the home or from the bar returns there,
 * with its scroll position. A page opened directly (new tab, shared link) has no in-app page before it, so it
 * goes to the fallback instead.
 *
 * Meant for the click handler of a link whose `href` is the fallback: a click with a modifier key (new tab,
 * new window) is left to the browser, which opens the fallback.
 */
export const useGoBack = (fallback: MaybeRefOrGetter<string>) => {
	const router = useRouter();

	return (event?: MouseEvent) => {
		if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
		if (event && event.button !== 0) return;
		event?.preventDefault();
		// vue-router keeps the previous in-app path in the history state; it is null on the first page.
		if (window.history.state?.back) {
			router.back();
			return;
		}
		void router.push(toValue(fallback));
	};
};
