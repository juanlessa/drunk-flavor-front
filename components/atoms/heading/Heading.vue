<template>
	<component :is="props.type" :class="HeadingStyle({ size: props.size })">
		<slot>{{ props.value }}</slot>
	</component>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import { tv } from 'tailwind-variants';
import type { HeadingSize, HeadingType } from './Heading';

const HeadingStyle = tv({
	base: 'text-black dark:text-white leading-shorter',
	variants: {
		size: {
			sm: 'text-xl',
			md: 'text-2xl',
			lg: 'text-4xl',
			'2xl': 'text-5xl',
			'3xl': 'text-6xl',
			'4xl': 'text-7xl',
			'5xl': 'text-8xl',
			'6xl': 'text-9xl'
		}
	}
});

const props = defineProps({
	size: {
		type: String as PropType<HeadingSize>,
		default: 'md'
	},
	type: {
		type: String as PropType<HeadingType>,
		default: 'h2'
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
