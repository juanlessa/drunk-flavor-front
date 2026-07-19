<template>
	<component
		:is="props.type"
		:class="
			textListStyle({
				size: props.size,
				weight: props.weight,
				gap: props.gap,
				marker: props.marker
			})
		"
		:reversed="props.type === 'ol' && props.reversed ? true : undefined">
		<slot>
			<li v-for="(item, index) in props.items" :key="index">{{ item }}</li>
		</slot>
	</component>
</template>
<script setup lang="ts">
import { tv } from 'tailwind-variants';
import type {
	TextListType,
	TextListMarker,
	TextListSize,
	TextListWeight,
	TextListGap
} from './TextList.types';
import { validateMarker } from './TextList.helpers';

const props = defineProps({
	type: {
		type: String as PropType<TextListType>,
		default: 'ul'
	},
	marker: {
		type: String as PropType<TextListMarker>,
		default: 'none',
		validator: validateMarker
	},
	reversed: {
		type: Boolean,
		default: false
	},
	size: {
		type: String as PropType<TextListSize>,
		default: 'md'
	},
	weight: {
		type: String as PropType<TextListWeight>,
		default: 'regular'
	},
	gap: {
		type: String as PropType<TextListGap>,
		default: 'md'
	},
	items: {
		type: Array as PropType<string[]>,
		default: () => []
	}
});

const textListStyle = tv({
	base: 'flex flex-col pl-5 text-black dark:text-white',
	variants: {
		size: {
			xxs: 'text-xxs',
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-md',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl'
		},
		weight: {
			regular: 'font-regular',
			medium: 'font-medium',
			bold: 'font-bold'
		},
		gap: {
			none: 'gap-0',
			sm: 'gap-1',
			md: 'gap-2',
			lg: 'gap-3',
			xl: 'gap-4'
		},
		marker: {
			none: 'list-none pl-0',
			disc: 'list-disc',
			circle: 'list-[circle]',
			square: 'list-[square]',
			decimal: 'list-decimal',
			'decimal-leading-zero': 'list-[decimal-leading-zero]',
			'lower-alpha': 'list-[lower-alpha]',
			'upper-alpha': 'list-[upper-alpha]',
			'lower-roman': 'list-[lower-roman]',
			'upper-roman': 'list-[upper-roman]'
		}
	}
});
</script>
