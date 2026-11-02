import { tv } from '~/utils/tv';

export const CARD_GRID_METRICS_PX = {
	gap: 16,
	managementRowHeight: 68,
	drinkRowHeight: 152
} as const;

export const virtualGridRowStyle = tv({
	base: 'justify-center w-full max-w-screen-desktop mx-auto gap-[var(--virtual-grid-items-gap)]',
	variants: {
		fixedHeight: {
			true: 'h-[var(--virtual-grid-item-height)]'
		},
		/**
		 * Lays the row out as equal columns, so an incomplete last row keeps the
		 * same card width as the full rows instead of stretching or centering.
		 */
		columns: {
			true: 'grid grid-cols-[repeat(var(--virtual-grid-columns),minmax(0,1fr))]'
		}
	}
});
