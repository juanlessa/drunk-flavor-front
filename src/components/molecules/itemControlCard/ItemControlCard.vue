<template>
	<div
		class="flex w-full tablet:max-w-[45%] py-2 px-4 rounded-lg gap-4 cursor-pointer bg-white dark:bg-gray-900 shadow-light-card dark:shadow-dark-card"
		@click="emit('click')">
		<div class="flex-1">
			<slot>
				<Text>{{ props.content }}</Text>
			</slot>
		</div>
		<button aria-label="delete" @click.stop="emit('action')">
			<TrashIcon />
		</button>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	content: {
		type: String,
		default: ''
	}
});

const emit = defineEmits<{
	(e: 'click' | 'action'): void;
}>();
</script>
