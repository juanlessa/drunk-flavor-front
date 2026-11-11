const SCROLLING_OVERFLOWS = ['auto', 'scroll', 'overlay'];
/**
 * The nearest ancestor that scrolls vertically, or `null` when the page itself (the window) scrolls,
 * which is the case in the layouts. Lists look for it instead of assuming the window, so they also
 * work inside a scrolling panel.
 */
export const findScrollParent = (element: HTMLElement | null): HTMLElement | null => {
	let parent = element?.parentElement ?? null;
	while (parent && parent !== document.body && parent !== document.documentElement) {
		if (SCROLLING_OVERFLOWS.includes(getComputedStyle(parent).overflowY)) return parent;
		parent = parent.parentElement;
	}
	return null;
};

/**
 * Height in px of the sticky top bar (the `--size-top-bar-block` token, which changes with the
 * breakpoint): the room to leave above something the window scrolls to, so it stops below the bar.
 * The token is a `calc()`, so it is measured on a throwaway element instead of parsed.
 */
export const getTopBarInset = (): number => {
	const probe = document.createElement('div');
	probe.style.cssText =
		'position:absolute;visibility:hidden;block-size:var(--size-top-bar-block)';
	document.body.appendChild(probe);
	const height = probe.getBoundingClientRect().height;
	probe.remove();
	return height;
};
