<template>
	<!-- Fills its nearest positioned ancestor, so the height comes from the layout, not from JS. -->
	<div v-bind="containerProps" class="absolute inset-0">
		<div v-bind="wrapperProps" class="flex flex-col" :style="{ gap: `${props.itemsGap}px` }">
			<slot :list="list"></slot>
			<slot v-if="props.loading" name="loading"></slot>
		</div>
	</div>
</template>
<script setup lang="ts" generic="AcceptableValue extends { [k: string]: any }">
import { useVirtualList, useInfiniteScroll } from '@vueuse/core';

const props = defineProps({
	items: { type: Array as PropType<AcceptableValue[]>, required: true },
	itemsGap: { type: Number, default: 0 },
	itemHeight: { type: Number, required: true },
	loading: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'loadMore'): void;
}>();

const itemsComputed = computed(() => props.items);

const { list, containerProps, wrapperProps } = useVirtualList(itemsComputed, {
	itemHeight: props.itemHeight + props.itemsGap
});

useInfiniteScroll(containerProps.ref, () => {
	if (props.loading) return;
	emit('loadMore');
});
</script>
