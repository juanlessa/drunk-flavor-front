<template>
	<!-- Outline when `filled` is off, solid when on: the color comes from the `text-*` of the consumer. -->
	<svg
		viewBox="0 0 24 24"
		aria-hidden="true"
		stroke="currentColor"
		stroke-width="2"
		stroke-linejoin="round"
		:fill="props.filled ? 'currentColor' : 'none'">
		<path
			d="M12 20.5s-7.8-4.7-9.7-9.6C1 7.4 2.9 4 6.3 3.7c2-.2 3.8.7 4.9 2.3l.8 1.1.8-1.1c1.1-1.6 2.9-2.5 4.9-2.3 3.4.3 5.3 3.7 4 7.2-1.9 4.9-9.7 9.6-9.7 9.6z" />
	</svg>
</template>
<script setup lang="ts">
const props = defineProps({
	filled: { type: Boolean, default: false }
});
</script>
