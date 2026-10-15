<template>
	<component
		:is="props.as"
		class="text-body font-regular text-content"
		:class="textListStyle({ gap: props.gap, marker: props.marker })"
		:reversed="props.as === 'ol' && props.reversed ? true : undefined">
		<slot>
			<li v-for="(item, index) in props.items" :key="index">{{ item }}</li>
		</slot>
	</component>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';
import type { TextListMarker, TextListGap } from './TextList.types';
import { validateMarker } from './TextList.helpers';

type TextListElement = 'ul' | 'ol';

const props = defineProps({
	as: {
		type: String as PropType<TextListElement>,
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
	base: 'flex flex-col pl-5',
	variants: {
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
