<template>
	<span class="text-body font-regular text-danger">
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
