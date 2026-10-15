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

/**
 * nuxt-typed-router narrows NuxtLink's `to` to the generated route union and
 * requires `external` for raw URLs. Anchor is a generic wrapper that also takes
 * `localePath()` output and absolute URLs (the footer links out to LinkedIn and
 * GitHub), both of which NuxtLink resolves at runtime. The value is therefore
 * widened to whatever NuxtLink currently declares instead of being duplicated.
 */
type NuxtLinkTo = NuxtRoute<RoutesNamesList, string, false>;

const linkTo = computed(() => props.to as NuxtLinkTo);
</script>
