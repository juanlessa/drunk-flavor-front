import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useInfiniteScroll, useVirtualList } from '@vueuse/core';
import { chunkArray } from '~/helpers/array';

/** Rows ahead of the viewport at which the next page starts loading. */
const PREFETCH_ROWS = 2;

export type UseVirtualInfiniteGridOptions<T> = {
	items: MaybeRefOrGetter<T[]>;
	/** Height of one row in px, without the gap. */
	rowHeight: MaybeRefOrGetter<number>;
	/** Space between rows in px. */
	gap?: MaybeRefOrGetter<number>;
	/** Items per row. Values below 1 are treated as 1. */
	columns?: MaybeRefOrGetter<number>;
	/** A page is being fetched. Blocks `onLoadMore`. */
	loading?: MaybeRefOrGetter<boolean>;
	/** Whether there is another page to fetch. Blocks `onLoadMore` when false. */
	canLoadMore?: MaybeRefOrGetter<boolean>;
	/**
	 * Distance in px from the bottom at which `onLoadMore` fires. Read once, because
	 * `useInfiniteScroll` does not track it. Defaults to two rows.
	 */
	distance?: number;
	/** Extra rows rendered outside the viewport. */
	overscan?: number;
	/** Return the promise of the request when there is one. */
	onLoadMore: () => void | Promise<void>;
};

/**
 * Virtualizes `items` as rows of `columns` items and asks for more when the scroll gets near the end.
 *
 * Bind `containerProps` to the scrolling element and `wrapperProps` to its only child, then render
 * `list`. Each entry holds one row (`data`, an array of items) and its row `index`.
 *
 * Accessibility: the rows are list items of a list, and only the rendered ones are in the DOM. Spread
 * `getRowAttrs(index)` on each row so assistive technology still gets its position in the whole list.
 *
 * The options accept refs and getters. Sizes are tracked because they are handed to
 * `useVirtualList` as a function; the cost is that the range is found by walking the rows, which
 * is fine for the few hundred rows these lists reach.
 */
export const useVirtualInfiniteGrid = <T>(options: UseVirtualInfiniteGridOptions<T>) => {
	const columns = computed(() => Math.max(1, Math.floor(toValue(options.columns) ?? 1)));
	const rowPitch = computed(() => toValue(options.rowHeight) + (toValue(options.gap) ?? 0));
	const rows = computed(() => chunkArray(toValue(options.items), columns.value));

	const { list, scrollTo, containerProps, wrapperProps } = useVirtualList(rows, {
		itemHeight: () => rowPitch.value,
		overscan: options.overscan
	});

	// `canLoadMore` is tracked by `useInfiniteScroll`, so when `loading` goes back to false the
	// scroll position is checked again and a short list keeps filling the viewport.
	useInfiniteScroll(containerProps.ref, () => options.onLoadMore(), {
		distance: options.distance ?? rowPitch.value * PREFETCH_ROWS,
		canLoadMore: () => !toValue(options.loading) && (toValue(options.canLoadMore) ?? true)
	});

	// `aria-setsize` is -1 while more pages can load, which is how ARIA says "the total is unknown".
	const getRowAttrs = (rowIndex: number) => ({
		role: 'listitem',
		'aria-posinset': rowIndex + 1,
		'aria-setsize': (toValue(options.canLoadMore) ?? true) ? -1 : rows.value.length
	});

	return { list, scrollTo, containerProps, wrapperProps, getRowAttrs };
};
