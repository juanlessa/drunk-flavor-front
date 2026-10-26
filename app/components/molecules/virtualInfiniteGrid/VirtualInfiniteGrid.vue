<template>
	<div v-bind="containerProps" :style="virtualGridStyle">
		<div
			v-bind="wrapperProps"
			class="flex flex-col px-4"
			:style="{ gap: 'var(--virtual-grid-items-gap)' }">
			<slot :list="list"></slot>
			<slot v-if="props.loading" name="loading"></slot>
		</div>
	</div>
</template>
<script setup lang="ts" generic="AcceptableValue extends { [k: string]: any }">
import { useVirtualList, useInfiniteScroll } from '@vueuse/core';
import { chunkArray } from '~/helpers/array';

const props = defineProps({
	items: { type: Array as PropType<AcceptableValue[]>, required: true },
	height: { type: [Number, String], required: true },
	itemsGap: { type: Number, default: 0 },
	itemHeight: { type: Number, required: true },
	gridColumns: { type: Number, default: 1 },
	loading: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'loadMore'): void;
}>();

const heightComputed = computed(() =>
	typeof props.height === 'number' ? `${props.height}px` : props.height
);
const virtualGridStyle = computed(() => ({
	height: heightComputed.value,
	'--virtual-grid-item-height': `${props.itemHeight}px`,
	'--virtual-grid-items-gap': `${props.itemsGap}px`
}));
const itemsComputed = computed(() => chunkArray(props.items, props.gridColumns));

const { list, containerProps, wrapperProps } = useVirtualList(itemsComputed, {
	itemHeight: props.itemHeight + props.itemsGap
});

useInfiniteScroll(containerProps.ref, () => {
	if (props.loading) return;
	emit('loadMore');
});
</script>
