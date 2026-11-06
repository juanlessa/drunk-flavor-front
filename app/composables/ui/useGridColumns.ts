import { computed } from 'vue';
import { useBreakpoints } from '@vueuse/core';

export type GridColumns = { mobile: number; tablet: number; desktop: number };

const DEFAULT_GRID_COLUMNS: GridColumns = { mobile: 1, tablet: 2, desktop: 3 };

let hasLoggedMissingToken = false;

/**
 * Reads a breakpoint from the CSS tokens (`breakpoints.css`), so the stylesheet stays the single
 * source of truth. An empty string makes the media query invalid, which never matches. That also
 * covers the server, where there is no document, so the layout falls back to the mobile column count.
 */
const readBreakpointToken = (token: string): string => {
	if (typeof document === 'undefined') return '';
	const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
	if (!value && !hasLoggedMissingToken) {
		hasLoggedMissingToken = true;
		console.error(`[useGridColumns] CSS token ${token} must be defined.`);
	}
	return value;
};

/**
 * Number of grid columns for the current viewport, driven by the `--breakpoint-*` CSS tokens.
 *
 * The count has to live in JS because the virtual grid chunks its items into rows. The visual
 * layout of each row stays in CSS.
 */
export const useGridColumns = (columns: GridColumns = DEFAULT_GRID_COLUMNS) => {
	const breakpoints = useBreakpoints({
		tablet: () => readBreakpointToken('--breakpoint-tablet'),
		desktop: () => readBreakpointToken('--breakpoint-desktop')
	});
	const isTablet = breakpoints.greaterOrEqual('tablet');
	const isDesktop = breakpoints.greaterOrEqual('desktop');

	return computed(() => {
		if (isDesktop.value) return columns.desktop;
		if (isTablet.value) return columns.tablet;
		return columns.mobile;
	});
};
