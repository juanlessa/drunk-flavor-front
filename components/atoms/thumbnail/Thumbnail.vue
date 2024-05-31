<template>
	<AvatarRoot as="div" class="h-[8.5rem] w-[7rem] rounded-md select-none overflow-hidden">
		<AvatarImage class="rounded-[inherit] object-cover" :src="props.src" alt="Colm Tuite" />
		<AvatarFallback
			class="h-full w-full flex items-center justify-center text-gray-600 bg-gray-100 text-lg font-medium"
			:delay-ms="600">
			<div>CT</div>
		</AvatarFallback>
	</AvatarRoot>
</template>

<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'radix-vue';

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
