<template>
	<div
		class="flex w-full h-10 tablet:max-w-[45%] py-2 px-4 rounded-lg gap-4 cursor-pointer bg-surface shadow-card"
		@click="emit('click')">
		<div class="flex-1">
			<slot>
				<Text>{{ props.content }}</Text>
			</slot>
		</div>
		<IconButton
			:aria-label="$t('molecules.itemControlCard.deleteButton.label')"
			@click.stop="emit('action')">
			<TrashIcon />
		</IconButton>
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
