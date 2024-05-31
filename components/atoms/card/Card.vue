<template>
	<div :class="cardStyle({ rounded: props.rounded })">
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { type PropType } from 'vue';
import { tv } from 'tailwind-variants';
import type { CardRounded } from './Card';

const cardStyle = tv({
	base: 'relative bg-white dark:bg-black',
	variants: {
		rounded: {
			px: 'rounded-px',
			xs: 'rounded-xs',
			sm: 'rounded-sm',
			md: 'rounded-md',
			lg: 'rounded-lg',
			full: 'rounded-full'
		}
	}
});

const props = defineProps({
	rounded: {
		type: String as PropType<CardRounded>,
		default: 'md'
	}
});
</script>
