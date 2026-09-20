<template>
	<NuxtLink class="text-body font-regular text-content cursor-pointer" :to="props.to">
		<slot>{{ props.value }}</slot>
	</NuxtLink>
</template>
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps({
	to: {
		type: [String, Object] as PropType<RouteLocationRaw | undefined>,
		default: undefined
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
