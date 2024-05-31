<template>
	<span class="text-md font-regular text-red-600">
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
