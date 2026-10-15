<template>
	<img class="h-full w-auto" :src="props.src" :alt="props.alt" />
</template>

<script setup lang="ts">
const props = defineProps({
	src: { type: String, required: true },
	alt: { type: String, required: true }
});
</script>
