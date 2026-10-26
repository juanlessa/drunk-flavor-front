<template>
	<component :is="props.as" :class="headingStyles({ size: props.size })">
		<slot>{{ props.value }}</slot>
	</component>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';
import type { HeadingSize, HeadingType } from './Heading.types';

const props = defineProps({
	as: {
		type: String as PropType<HeadingType>,
		default: 'h2'
	},
	value: {
		type: String,
		default: ''
	},
	size: {
		type: String as PropType<HeadingSize>,
		default: 'title'
	}
});

const headingStyles = tv({
	base: 'font-bold text-content',
	variants: {
		size: {
			titleSm: 'text-title-sm',
			title: 'text-title',
			titleLg: 'text-title-lg',
			headlineSm: 'text-headline-sm',
			headline: 'text-headline',
			headlineLg: 'text-headline-lg'
		}
	},
	defaultVariants: {
		size: 'title'
	}
});
</script>
