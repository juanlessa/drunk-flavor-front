import { tv } from '~/utils/tv';
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

export const itemControlCardStyle = tv({
	base: 'flex w-full tablet:max-w-control-card py-2 px-4 rounded-control-card gap-4 cursor-pointer bg-surface border border-stroke shadow-card hover:bg-surface-hover transition-colors duration-short',
	variants: {
		skeleton: {
			true: 'items-center'
		}
	}
});

export const itemControlCardDimensions = {
	height: `${CARD_GRID_METRICS_PX.controlRowHeight}px`
} as const;
