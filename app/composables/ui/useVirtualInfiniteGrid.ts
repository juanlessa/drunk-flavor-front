import {
	computed,
	nextTick,
	onMounted,
	ref,
	shallowRef,
	toValue,
	watch,
	type MaybeRefOrGetter
} from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { findScrollParent, getTopBarInset } from '~/helpers/scroll.helpers';
import { chunkArray } from '~/helpers/array';
/** Rows ahead of the viewport at which the next page starts loading. */
const PREFETCH_ROWS = 2;
/** Rows rendered above and below the viewport by default, so fast scrolling does not show blanks. */
const DEFAULT_OVERSCAN_ROWS = 5;
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
	/** Distance in px from the list end to the viewport bottom that fires `onLoadMore`. Defaults to two rows. */
	distance?: MaybeRefOrGetter<number | undefined>;
	/** Extra rows rendered outside the viewport. */
	overscan?: number;
	/**
	 * Splits the items into rows. Defaults to equal rows of `columns` items; provide it when some
	 * items (e.g. a group header) must sit alone in their own row. Every row has the same height.
	 */
	chunk?: (items: T[], columns: number) => T[][];
	/** Return the promise of the request when there is one. */
	onLoadMore: () => void | Promise<void>;
};
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
/**
 * Virtualizes `items` as rows of `columns` items and asks for more when the page scroll gets near the
 * end of the list.
 *
 * The list does not scroll by itself: its nearest scrolling ancestor does, or the window when there
 * is none (which is what scrolls in the layouts). The rows outside the visible area are not rendered and
 * the space they would take is kept as padding on the wrapper, so the list always has the height of
 * all loaded rows.
 *
 * Bind `containerProps` to the list element (it is only measured, never scrolled) and `wrapperProps`
 * to its only child, then render `list`. Each entry holds one row (`data`, an array of items) and its
 * row `index`. Every row must have the same height.
 *
 * Accessibility: the rows are list items of a list, and only the rendered ones are in the DOM. Spread
 * `getRowAttrs(index)` on each row so assistive technology still gets its position in the whole list.
 */
export const useVirtualInfiniteGrid = <T>(options: UseVirtualInfiniteGridOptions<T>) => {
	const columns = computed(() => Math.max(1, Math.floor(toValue(options.columns) ?? 1)));
	const rowPitch = computed(() => toValue(options.rowHeight) + (toValue(options.gap) ?? 0));
	const rows = computed(() =>
		(options.chunk ?? chunkArray)(toValue(options.items), columns.value)
	);
	const overscan = options.overscan ?? DEFAULT_OVERSCAN_ROWS;
	const container = ref<HTMLElement | null>(null);
	// What scrolls the list: the nearest scrolling ancestor, found on mount, or else the window.
	const scroller = shallowRef<HTMLElement | null>(null);
	const scrollTarget = shallowRef<HTMLElement | Window | undefined>(undefined);
	// Before the first measure (server and first client render) only the rows near the top are rendered.
	const range = ref({ start: 0, end: overscan * 2 });
	const start = computed(() => clamp(range.value.start, 0, rows.value.length));
	const end = computed(() => clamp(range.value.end, start.value, rows.value.length));
	const list = computed(() =>
		rows.value
			.slice(start.value, end.value)
			.map((data, offset) => ({ data, index: start.value + offset }))
	);
	// The rows before and after the rendered ones keep their space, so the list height is the full one.
	const wrapperProps = computed(() => ({
		style: {
			paddingTop: `${start.value * rowPitch.value}px`,
			paddingBottom: `${(rows.value.length - end.value) * rowPitch.value}px`
		}
	}));
	let fetching = false;
	const loadMore = () => {
		if (fetching) return;
		fetching = true;
		const rowsBefore = rows.value.length;
		void Promise.resolve(options.onLoadMore()).finally(() => {
			fetching = false;
			// A page that added rows may still not fill the viewport; one that failed is not retried in a loop.
			if (rows.value.length !== rowsBefore) void nextTick(update);
		});
	};
	const update = () => {
		const element = container.value;
		const pitch = rowPitch.value;
		if (!element || pitch <= 0) return;
		const rect = element.getBoundingClientRect();
		// The visible area: the scroller's box, or the whole window.
		const scrollerRect = scroller.value?.getBoundingClientRect();
		const areaTop = scrollerRect?.top ?? 0;
		const areaHeight = scroller.value ? scroller.value.clientHeight : window.innerHeight;
		const listTop = rect.top - areaTop;
		const first = Math.floor(-listTop / pitch);
		const last = Math.ceil((areaHeight - listTop) / pitch);
		const nextStart = Math.max(0, first - overscan);
		const nextEnd = Math.max(nextStart, last + overscan);
		if (nextStart !== range.value.start || nextEnd !== range.value.end) {
			range.value = { start: nextStart, end: nextEnd };
		}
		const distance = toValue(options.distance) ?? pitch * PREFETCH_ROWS;
		const canLoad = !toValue(options.loading) && (toValue(options.canLoadMore) ?? true);
		if (canLoad && rect.bottom - (areaTop + areaHeight) <= distance) loadMore();
	};
	onMounted(() => {
		scroller.value = findScrollParent(container.value);
		scrollTarget.value = scroller.value ?? window;
		update();
	});
	useEventListener(scrollTarget, 'scroll', update, { passive: true });
	// The content area changes size with the window and with the mobile browser bars.
	useResizeObserver(scroller, update);
	useEventListener(typeof window === 'undefined' ? undefined : window, 'resize', update, {
		passive: true
	});
	// A new page, a layout change or the end of a request can move the end of the list into view.
	watch(
		[
			() => rows.value.length,
			rowPitch,
			() => toValue(options.loading),
			() => toValue(options.canLoadMore)
		],
		() => void nextTick(update)
	);
	/** Scrolls so the row at `index` is at the top of the visible area. */
	const scrollTo = (index: number) => {
		const element = container.value;
		if (!element) return;
		const areaTop = scroller.value?.getBoundingClientRect().top ?? 0;
		const offset = element.getBoundingClientRect().top - areaTop + index * rowPitch.value;
		if (scroller.value) {
			scroller.value.scrollTo({ top: scroller.value.scrollTop + offset });
			return;
		}
		// The window scrolls under the sticky top bar: stop below it, not behind it.
		window.scrollTo({ top: window.scrollY + offset - getTopBarInset() });
	};
	// `aria-setsize` is -1 while more pages can load, which is how ARIA says "the total is unknown".
	const getRowAttrs = (rowIndex: number) => ({
		role: 'listitem',
		'aria-posinset': rowIndex + 1,
		'aria-setsize': (toValue(options.canLoadMore) ?? true) ? -1 : rows.value.length
	});
	return { list, scrollTo, containerProps: { ref: container }, wrapperProps, getRowAttrs };
};
