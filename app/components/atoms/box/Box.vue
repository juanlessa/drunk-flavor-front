<template>
	<div :class="containerStyle({ direction: props.direction, container: props.container })">
		<slot></slot>
	</div>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type { BoxContainerBreakpoint } from './Box.types';

const props = defineProps({
	direction: {
		type: String as PropType<'row' | 'col' | 'responsive' | 'wrap' | 'container-responsive'>,
		default: 'responsive'
	},
	container: {
		type: Boolean,
		default: false
	},
	containerBreakpoint: {
		type: String as PropType<BoxContainerBreakpoint>,
		default: 'md'
	}
});

const containerStyle = tv({
	base: 'flex',
	variants: {
		direction: {
			row: 'flex-row',
			col: 'flex-col',
			responsive: 'flex-col tablet:flex-row',
			wrap: 'flex-row flex-wrap',
			'container-responsive': `flex-col @${props.containerBreakpoint}:flex-row`
		},
		container: {
			true: '@container'
		}
	}
});
</script>
