<template>
	<div class="flex flex-col gap-6">
		<template v-if="$slots.title || props.title">
			<slot name="title">
				<Heading as="h2" class="text-center">{{ props.title }}</Heading>
			</slot>
		</template>
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
