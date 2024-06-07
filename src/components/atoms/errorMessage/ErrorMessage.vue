<template>
	<span class="text-md font-regular text-red-600 dark:text-red-400">
		<slot>{{ props.value }}</slot>
	</span>
</template>
<script setup lang="ts">
const props = defineProps({
	value: {
		type: String,
		default: ''
	}
});
</script>
