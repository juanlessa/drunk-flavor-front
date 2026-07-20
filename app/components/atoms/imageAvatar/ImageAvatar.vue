<template>
	<Avatar.Root
		as="div"
		:class="imageAvatarStyle({ rounded: props.rounded })"
		:style="{ width: props.width, height: props.height }">
		<Avatar.Image
			class="h-full w-full rounded-[inherit] object-cover"
			:src="props.src"
			:alt="props.alt" />
		<Avatar.Fallback
			class="h-full w-full flex items-center justify-center text-gray-600 text-lg font-medium rounded-[inherit]"
			:delay-ms="600">
			<slot name="fallback">{{ props.alt }}</slot>
		</Avatar.Fallback>
	</Avatar.Root>
</template>

<script setup lang="ts">
import { tv } from 'tailwind-variants';
import { Avatar } from 'radix-vue/namespaced';
import type { ImageAvatarRounded, ImageAvatarWidth, ImageAvatarHeight } from './ImageAvatar.types';

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
		type: String as PropType<ImageAvatarWidth>,
		default: '3rem'
	},
	/** Any valid CSS height value (e.g. '8.5rem', '136px', '100%', 'auto') */
	height: {
		type: String as PropType<ImageAvatarHeight>,
		default: '3rem'
	},
	rounded: {
		type: String as PropType<ImageAvatarRounded>,
		default: 'full'
	}
});

const imageAvatarStyle = tv({
	base: 'select-none overflow-hidden',
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
