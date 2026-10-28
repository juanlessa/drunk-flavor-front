<template>
	<Avatar.Root :class="avatarStyles({ size: props.size })">
		<Avatar.Image
			v-if="props.src"
			:src="props.src"
			:alt="props.alt"
			class="size-full object-cover" />
		<Avatar.Fallback
			:delay-ms="props.fallbackDelay"
			class="size-full flex items-center justify-center bg-accent-subtle text-accent-content dark:bg-blue-950 dark:text-neutral-300">
			<ProfileIcon class="size-1/2" />
			<span class="sr-only">{{ props.alt }}</span>
		</Avatar.Fallback>
	</Avatar.Root>
</template>

<script setup lang="ts">
import { Avatar } from 'radix-vue/namespaced';
import ProfileIcon from '~/components/icons/ProfileIcon.vue';
import { tv } from '~/utils/tv';

const props = defineProps({
	src: { type: String, default: '' },
	alt: { type: String, required: true },
	size: { type: String as PropType<'sm' | 'md' | 'lg'>, default: 'md' },
	fallbackDelay: { type: Number, default: 100 }
});

const avatarStyles = tv({
	base: 'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-sunken ring-2 ring-surface shadow-sm',
	variants: {
		size: {
			sm: 'size-10',
			md: 'size-16',
			lg: 'size-24'
		}
	}
});
</script>
