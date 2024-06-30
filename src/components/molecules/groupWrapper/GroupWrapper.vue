<template>
	<div class="flex flex-col gap-6">
		<div v-if="$slots.title || props.title">
			<slot name="title">
				<Heading type="h2" class="text-center">{{ props.title }}</Heading>
			</slot>
		</div>
		<div v-bind="$attrs">
			<slot></slot>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		default: ''
	}
});
</script>
