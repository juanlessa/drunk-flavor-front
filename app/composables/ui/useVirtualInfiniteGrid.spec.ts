import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useVirtualInfiniteGrid } from './useVirtualInfiniteGrid';

const ROW_HEIGHT = 40;
const GAP = 10;
const PITCH = ROW_HEIGHT + GAP;
const VIEWPORT_HEIGHT = 500;
const OVERSCAN = 2;

type Setup = { total: number; canLoadMore?: boolean; loading?: boolean };

const mountGrid = ({ total, canLoadMore = true, loading = false }: Setup) => {
	layout.total = total;
	const items = ref(Array.from({ length: total }, (_, index) => ({ id: index })));
	const loadingRef = ref(loading);
	const canLoadMoreRef = ref(canLoadMore);
	const onLoadMore = vi.fn();
	let grid!: ReturnType<typeof useVirtualInfiniteGrid<{ id: number }>>;
	const wrapper = mount(
		defineComponent({
			setup() {
				grid = useVirtualInfiniteGrid({
					items,
					rowHeight: ROW_HEIGHT,
					gap: GAP,
					loading: loadingRef,
					canLoadMore: canLoadMoreRef,
					overscan: OVERSCAN,
					onLoadMore
				});
				return () =>
					h('div', { ref: grid.containerProps.ref }, [h('div', grid.wrapperProps.value)]);
			}
		}),
		{ attachTo: document.body }
	);
	return { wrapper, grid, items, loadingRef, canLoadMoreRef, onLoadMore };
};

/** Where the list is in the viewport: `top` is the distance from the viewport top to the list top. */
const layout = { top: 0, total: 0 };
const placeList = (top: number) => {
	layout.top = top;
};

const scrollWindow = async () => {
	// The scroll listener is attached once the scroll target is known, after mount.
	await nextTick();
	window.dispatchEvent(new Event('scroll'));
	await nextTick();
};

describe('useVirtualInfiniteGrid', () => {
	beforeEach(() => {
		layout.top = 0;
		vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(VIEWPORT_HEIGHT);
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => {
			const height = layout.total * PITCH - GAP;
			return {
				top: layout.top,
				bottom: layout.top + height,
				height,
				left: 0,
				right: 0,
				width: 0,
				x: 0,
				y: layout.top,
				toJSON: () => ({})
			};
		});
	});
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = '';
	});

	it('renders only the rows near the viewport and keeps the space of the others as padding', async () => {
		const { grid } = mountGrid({ total: 100, canLoadMore: false });
		placeList(0);
		await scrollWindow();
		const visibleRows = Math.ceil(VIEWPORT_HEIGHT / PITCH);
		expect(grid.list.value.map((row) => row.index)).toEqual(
			Array.from({ length: visibleRows + OVERSCAN }, (_, index) => index)
		);
		expect(grid.wrapperProps.value.style.paddingTop).toBe('0px');
		expect(grid.wrapperProps.value.style.paddingBottom).toBe(
			`${(100 - visibleRows - OVERSCAN) * PITCH}px`
		);
	});

	it('moves the rendered window with the page scroll', async () => {
		const { grid } = mountGrid({ total: 100, canLoadMore: false });
		// The page has scrolled 20 rows into the list.
		placeList(-20 * PITCH);
		await scrollWindow();
		expect(grid.list.value[0]?.index).toBe(20 - OVERSCAN);
		expect(grid.wrapperProps.value.style.paddingTop).toBe(`${(20 - OVERSCAN) * PITCH}px`);
	});

	it('keeps the height of the whole list across the rendered window', async () => {
		const total = 100;
		const { grid } = mountGrid({ total, canLoadMore: false });
		placeList(-30 * PITCH);
		await scrollWindow();
		const rendered = grid.list.value.length;
		const { paddingTop, paddingBottom } = grid.wrapperProps.value.style;
		const height = parseInt(paddingTop) + (rendered * PITCH - GAP) + parseInt(paddingBottom);
		expect(height).toBe(total * PITCH - GAP);
	});

	it('asks for more rows when the end of the list gets near the viewport bottom', async () => {
		const { onLoadMore } = mountGrid({ total: 10 });
		// 10 rows of 50px: the list ends at 490px, inside the 500px viewport.
		placeList(0);
		await scrollWindow();
		expect(onLoadMore).toHaveBeenCalled();
	});

	it('does not ask for more rows while the end of the list is far from the viewport', async () => {
		const { onLoadMore } = mountGrid({ total: 100 });
		placeList(0);
		await scrollWindow();
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('does not ask for more rows while loading or after the last page', async () => {
		const loadingGrid = mountGrid({ total: 10, loading: true });
		placeList(0);
		const lastPageGrid = mountGrid({ total: 10, canLoadMore: false });
		placeList(0);
		await scrollWindow();
		expect(loadingGrid.onLoadMore).not.toHaveBeenCalled();
		expect(lastPageGrid.onLoadMore).not.toHaveBeenCalled();
	});

	it('checks again when a page ends and the list still does not fill the viewport', async () => {
		const { loadingRef, onLoadMore } = mountGrid({ total: 10, loading: true });
		placeList(0);
		await scrollWindow();
		expect(onLoadMore).not.toHaveBeenCalled();
		loadingRef.value = false;
		await nextTick();
		await nextTick();
		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it('gives the position of a row, with an unknown size while more pages can load', () => {
		const more = mountGrid({ total: 6 });
		expect(more.grid.getRowAttrs(2)).toEqual({
			role: 'listitem',
			'aria-posinset': 3,
			'aria-setsize': -1
		});
		const last = mountGrid({ total: 6, canLoadMore: false });
		expect(last.grid.getRowAttrs(0)['aria-setsize']).toBe(6);
	});

	it('uses the nearest scrolling ancestor instead of the window', async () => {
		const scroller = document.createElement('div');
		scroller.style.overflowY = 'auto';
		document.body.appendChild(scroller);
		vi.spyOn(scroller, 'clientHeight', 'get').mockReturnValue(200);
		// Own properties, so they do not change the prototype stub that places the list.
		const SCROLLER_TOP = 100;
		scroller.getBoundingClientRect = () => new DOMRect(0, SCROLLER_TOP, 0, 200);
		const items = ref(Array.from({ length: 100 }, (_, index) => ({ id: index })));
		let grid!: ReturnType<typeof useVirtualInfiniteGrid<{ id: number }>>;
		mount(
			defineComponent({
				setup() {
					grid = useVirtualInfiniteGrid({
						items,
						rowHeight: ROW_HEIGHT,
						gap: GAP,
						canLoadMore: false,
						overscan: OVERSCAN,
						onLoadMore: vi.fn()
					});
					return () => h('div', { ref: grid.containerProps.ref });
				}
			}),
			{ attachTo: scroller }
		);
		// The content area has scrolled 10 rows into the list.
		layout.total = 100;
		placeList(SCROLLER_TOP - 10 * PITCH);
		await nextTick();
		scroller.dispatchEvent(new Event('scroll'));
		await nextTick();
		const visibleRows = Math.ceil(200 / PITCH);
		expect(grid.list.value[0]?.index).toBe(10 - OVERSCAN);
		expect(grid.list.value.at(-1)?.index).toBe(10 + visibleRows + OVERSCAN - 1);
	});
});
