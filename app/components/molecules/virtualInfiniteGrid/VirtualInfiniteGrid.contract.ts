import { tv } from '~/utils/tv';

export const CARD_GRID_METRICS_PX = {
	gap: 16,
	managementRowHeight: 68,
	drinkRowHeight: 152
} as const;

export const virtualGridRowStyle = tv({
	base: 'justify-center mx-auto gap-[var(--virtual-grid-items-gap)]',
	variants: {
		fixedHeight: {
			true: 'h-[var(--virtual-grid-item-height)]'
		},
		/**
		 * Lays the row out as equal columns, so an incomplete last row keeps the same card width as the full rows
		 * instead of stretching or centering. The columns take the width of the page content (`w-page-content`),
		 * which makes each card as wide as a card of the home, where the cards size themselves by a share of the row.
		 * Without it the row is the whole row, up to the desktop width, and its cards size themselves.
		 */
		columns: {
			true: 'w-page-content grid grid-cols-[repeat(var(--virtual-grid-columns),minmax(0,1fr))]',
			false: 'w-full max-w-screen-desktop'
		}
	},
	defaultVariants: { columns: false }
});
