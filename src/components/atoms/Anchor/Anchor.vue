<template>
	<NuxtLink :class="anchorStyle({ size: props.size, weight: props.weight })" :to="props.to">
		<slot>{{ props.value }}</slot>
	</NuxtLink>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type { RouteLocationRaw } from 'vue-router';
import type { AnchorSize, AnchorWeight } from '~/types/Anchor';

const anchorStyle = tv({
	base: 'text-black dark:text-white',
	variants: {
		size: {
			xxs: 'text-xxs',
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-md',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'4xl': 'text-4xl',
			'5xl': 'text-5xl',
			'6xl': 'text-6xl',
			'7xl': 'text-7xl',
			'8xl': 'text-8xl',
			'9xl': 'text-9xl'
		},
		weight: {
			regular: 'font-regular',
			medium: 'font-medium',
			bold: 'font-bold'
		}
	}
});

const props = defineProps({
	to: {
		type: [String, Object] as PropType<RouteLocationRaw | undefined>,
		default: undefined
	},
	size: {
		type: String as PropType<AnchorSize>,
		default: 'md'
	},

	weight: {
		type: String as PropType<AnchorWeight>,
		default: 'regular'
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
