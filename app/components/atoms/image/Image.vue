<template>
	<div
		v-if="!props.strict || isReady"
		:class="imageStyle({ rounded: props.rounded })"
		:style="{ width: props.width, height: props.height }">
		<img
			v-if="isReady"
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.src"
			:alt="props.alt" />

		<div
			v-else-if="isLoading"
			class="h-full w-full flex items-center justify-center bg-gray-50 rounded-[inherit]">
			<slot name="loading" />
		</div>

		<div
			v-else
			class="h-full w-full flex items-center justify-center text-gray-600 bg-gray-100 rounded-[inherit]">
			<slot name="fallback">
				<span class="text-sm">{{ props.alt }}</span>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useImage } from '@vueuse/core';
import { tv } from 'tailwind-variants';
import type { ImageRounded, ImageWidth, ImageHeight } from './Image.types';

const props = defineProps({
	src: {
		type: String,
		default: ''
	},
	alt: {
		type: String,
		default: ''
	},
	/** Any valid CSS width value (e.g. '7rem', '100px', '50%', 'auto') */
	width: {
		type: String as PropType<ImageWidth>,
		default: '7rem'
	},
	/** Any valid CSS height value (e.g. '8.5rem', '136px', '100%', 'auto') */
	height: {
		type: String as PropType<ImageHeight>,
		default: '8.5rem'
	},
	rounded: {
		type: String as PropType<ImageRounded>,
		default: 'md'
	},
	/** When true, the image is only displayed if it loads successfully */
	strict: {
		type: Boolean,
		default: false
	}
});

const { isLoading, error, state } = useImage(() => ({ src: props.src }));

const isReady = computed(() => {
	if (!props.src) return false;
	if (isLoading.value) return false;
	if (error.value) return false;
	if (props.strict && !state.value) return false;
	return !!state.value;
});

const imageStyle = tv({
	base: 'overflow-hidden',
	variants: {
		rounded: {
			none: 'rounded-none',
			px: 'rounded-px',
			xs: 'rounded-xs',
			sm: 'rounded-sm',
			md: 'rounded-md',
			lg: 'rounded-lg',
			full: 'rounded-full'
		}
	}
});
</script>
