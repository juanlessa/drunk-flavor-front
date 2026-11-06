<template>
	<NuxtLink class="text-body font-regular text-content cursor-pointer" :to="linkTo">
		<slot>{{ props.value }}</slot>
	</NuxtLink>
</template>
<script setup lang="ts">
import type { NuxtRoute, RoutesNamesList } from '@typed-router';
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

type NuxtLinkTo = NuxtRoute<RoutesNamesList, string, false>;

const linkTo = computed(() => props.to as NuxtLinkTo);
</script>
