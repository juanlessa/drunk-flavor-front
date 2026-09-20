<template>
	<div
		class="w-full h-drink-cover bg-center bg-no-repeat bg-cover rounded-media overflow-hidden"
		:role="isDecorative ? undefined : 'img'"
		:aria-label="isDecorative ? undefined : props.alt"
		:aria-hidden="isDecorative ? 'true' : undefined"
		:style="{ backgroundImage: `url(${props.src})` }" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	src: {
		type: String,
		required: true
	},
	alt: {
		type: String,
		default: ''
	}
});

const isDecorative = computed(() => props.alt.trim() === '');
</script>
