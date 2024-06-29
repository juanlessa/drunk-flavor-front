export const remToPixels = (rem: number) => {
	if (import.meta.server) return 16 * rem;

	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return rem * rootFontSize;
};
