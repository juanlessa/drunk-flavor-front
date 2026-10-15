<template>
	<label :for="props.for" class="text-body font-regular text-content">
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
