import { tv } from '~/utils/tv';

export const CARD_GRID_METRICS_PX = {
	gap: 16,
	controlRowHeight: 40,
	drinkRowHeight: 152
} as const;

export const virtualGridRowStyle = tv({
	base: 'justify-center w-full max-w-screen-desktop mx-auto gap-[var(--virtual-grid-items-gap)]',
	variants: {
		fixedHeight: {
			true: 'h-[var(--virtual-grid-item-height)]'
		}
	}
});
