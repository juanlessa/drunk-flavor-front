<template>
	<label :for="props.for" class="text-md font-regular text-black dark:text-white">
		<slot>{{ props.value }}</slot>
	</label>
</template>
<script setup lang="ts">
const props = defineProps({
	for: {
		type: String,
		default: ''
	},
	value: {
		type: String,
		default: ''
	}
});
</script>
