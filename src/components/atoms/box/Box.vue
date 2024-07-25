<template>
	<div :class="containerStyle({ direction: props.direction })">
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';

const props = defineProps({
	direction: { type: String as PropType<'row' | 'col' | 'responsive'>, default: 'responsive' }
});

const containerStyle = tv({
	base: 'flex flex-1 w-full',
	variants: {
		direction: {
			row: 'flex-row items-center',
			col: 'flex-col',
			responsive: 'flex-col tablet:flex-row'
		}
	}
});
</script>
