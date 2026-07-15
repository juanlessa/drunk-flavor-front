<template>
	<div ref="container" class="flex flex-col w-full overflow-y-scroll">
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core';

const props = defineProps({
	loading: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'loadMore'): void;
}>();

const container = ref<HTMLElement | null>(null);

useInfiniteScroll(
	container,
	() => {
		if (props.loading) return;
		emit('loadMore');
	},
	{ distance: 10 }
);
</script>
