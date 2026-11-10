const SCROLLING_OVERFLOWS = ['auto', 'scroll', 'overlay'];
/**
 * The nearest ancestor that scrolls vertically, or `null` when the page itself (the window) scrolls.
 * The layouts keep the top bar and the footer in place and scroll only the content between them,
 * so lists look for it instead of assuming the window.
 */
export const findScrollParent = (element: HTMLElement | null): HTMLElement | null => {
	let parent = element?.parentElement ?? null;
	while (parent && parent !== document.body && parent !== document.documentElement) {
		if (SCROLLING_OVERFLOWS.includes(getComputedStyle(parent).overflowY)) return parent;
		parent = parent.parentElement;
	}
	return null;
};
