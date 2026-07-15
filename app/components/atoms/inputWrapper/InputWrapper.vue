<template>
	<div class="w-full flex flex-col gap-1">
		<div :class="containerStyle({ direction: props.direction })">
			<slot name="label"></slot>
			<slot></slot>
		</div>
		<slot name="error"></slot>
	</div>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';

const props = defineProps({
	direction: { type: String as PropType<'row' | 'column'>, default: 'column' }
});

const containerStyle = tv({
	base: 'flex gap-2',
	variants: {
		direction: {
			row: 'flex-row items-center',
			column: 'flex-col'
		}
	}
});
</script>
