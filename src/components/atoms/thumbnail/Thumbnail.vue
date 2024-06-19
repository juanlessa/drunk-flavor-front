<template>
	<Avatar.Root as="div" class="h-[8.5rem] w-[7rem] rounded-md select-none overflow-hidden">
		<Avatar.Image class="rounded-[inherit] object-cover" :src="props.src" alt="Colm Tuite" />
		<Avatar.Fallback
			class="h-full w-full flex items-center justify-center text-gray-600 bg-gray-100 text-lg font-medium"
			:delay-ms="600">
			<div>CT</div>
		</Avatar.Fallback>
	</Avatar.Root>
</template>

<script setup lang="ts">
import { Avatar } from 'radix-vue/namespaced';

const props = defineProps({
	src: {
		type: String,
		default: ''
	},
	alt: {
		type: String,
		default: ''
	}
});
</script>
