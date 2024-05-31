<template>
	<component :is="props.type" :class="textStyle({ size: props.size, weight: props.weight })">
		<slot>{{ props.value }}</slot>
	</component>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import { tv } from 'tailwind-variants';

const textStyle = tv({
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

type TextType = 'p' | 'span' | 'strong';
type TextWeight = 'regular' | 'medium' | 'bold';
type TextSize =
	| 'xxs'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

const props = defineProps({
	size: {
		type: String as PropType<TextSize>,
		default: 'md'
	},
	type: {
		type: String as PropType<TextType>,
		default: 'p'
	},
	weight: {
		type: String as PropType<TextWeight>,
		default: 'regular'
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
