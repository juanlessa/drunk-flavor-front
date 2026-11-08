<template>
	<!-- Fills its nearest positioned ancestor, so the height comes from the layout, not from JS. -->
	<!--
		A labelled list, and focusable so keyboard users can scroll it when it has no focusable
		content (e.g. while only the loading skeleton is shown). The rows are its list items.
	-->
	<div
		v-bind="containerProps"
		role="list"
		tabindex="0"
		:aria-label="props.label"
		:aria-busy="props.loading"
		class="absolute inset-0 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:-outline-offset-2"
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
	distance: { type: Number, default: undefined }
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
	onLoadMore: () => emit('loadMore')
});
</script>
