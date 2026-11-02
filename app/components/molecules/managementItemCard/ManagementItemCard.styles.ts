import { tv } from '~/utils/tv';
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

export const managementItemCardStyle = tv({
	base: 'flex items-center gap-2 w-full pr-3 rounded-control-card bg-surface border border-stroke shadow-card',
	variants: {
		skeleton: {
			false: 'hover:bg-surface-hover transition-colors duration-short'
		}
	},
	defaultVariants: {
		skeleton: false
	}
});

/** Content area; shared with the skeleton so both keep the same insets. */
export const managementItemCardContentStyle = tv({
	base: 'flex-1 min-w-0 h-full flex items-center gap-3',
	variants: {
		media: {
			true: 'pl-3',
			false: 'pl-4'
		}
	},
	defaultVariants: {
		media: false
	}
});

export const managementItemCardDimensions = {
	height: `${CARD_GRID_METRICS_PX.managementRowHeight}px`
} as const;
