<template>
	<!--
		A labelled list whose rows are its list items. It does not scroll by itself: the page does, so
		it has the height of all its rows and keyboard users scroll the page as anywhere else.
		The scroll anchoring of the browser is off, because the rows are swapped while the page scrolls.
	-->
	<div
		v-bind="containerProps"
		role="list"
		:aria-label="props.label"
		:aria-busy="props.loading"
		class="relative w-full [overflow-anchor:none]"
		:style="virtualGridStyle">
		<div
			v-bind="wrapperProps"
			class="flex flex-col px-4"
			:style="{ gap: 'var(--virtual-grid-items-gap)' }">
			<slot :list="list" :row-attrs="getRowAttrs"></slot>
			<slot v-if="props.loading" name="loading"></slot>
		</div>
	</div>
</template>
<script setup lang="ts" generic="AcceptableValue extends { [k: string]: any }">
import { useVirtualInfiniteGrid } from '~/composables/ui/useVirtualInfiniteGrid';
const props = defineProps({
	/** Accessible name of the list. */
	label: { type: String, required: true },
	items: { type: Array as PropType<AcceptableValue[]>, required: true },
	itemsGap: { type: Number, default: 0 },
	itemHeight: { type: Number, required: true },
	gridColumns: { type: Number, default: 1 },
	loading: { type: Boolean, default: false },
	/** False once the last page was fetched, so scrolling to the end stops asking for more. */
	canLoadMore: { type: Boolean, default: true },
	/** Distance in px from the bottom that triggers `loadMore`. Defaults to two rows. */
	distance: { type: Number, default: undefined },
	/** Custom split of `items` into rows (defaults to equal rows of `gridColumns` items). */
	chunk: {
		type: Function as PropType<
			(items: AcceptableValue[], columns: number) => AcceptableValue[][]
		>,
		default: undefined
	}
});
const emit = defineEmits<{
	(e: 'loadMore'): void;
}>();

const virtualGridStyle = computed(() => ({
	'--virtual-grid-item-height': `${props.itemHeight}px`,
	'--virtual-grid-items-gap': `${props.itemsGap}px`,
	'--virtual-grid-columns': `${props.gridColumns}`
}));

const { list, containerProps, wrapperProps, getRowAttrs } = useVirtualInfiniteGrid({
	items: () => props.items,
	rowHeight: () => props.itemHeight,
	gap: () => props.itemsGap,
	columns: () => props.gridColumns,
	loading: () => props.loading,
	canLoadMore: () => props.canLoadMore,
	distance: props.distance,
	chunk: props.chunk ? (items, columns) => props.chunk!(items, columns) : undefined,
	onLoadMore: () => emit('loadMore')
});
</script>
