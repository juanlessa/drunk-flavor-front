<template>
	<component
		:is="props.as"
		:class="containerStyle({ direction: props.direction, container: props.container })">
		<slot></slot>
	</component>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type { BoxAs, BoxDirection } from './Box.types';

const props = defineProps({
	as: {
		type: String as PropType<BoxAs>,
		default: 'div'
	},
	direction: {
		type: String as PropType<BoxDirection>,
		default: 'responsive'
	},
	container: {
		type: Boolean,
		default: false
	}
});

const containerStyle = tv({
	base: 'flex',
	variants: {
		direction: {
			row: 'flex-row',
			col: 'flex-col',
			responsive: 'flex-col tablet:flex-row',
			wrap: 'flex-row flex-wrap'
		},
		container: {
			true: '@container'
		}
	}
});
</script>
