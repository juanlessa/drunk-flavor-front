<template>
	<div :class="itemControlCardStyle()" :style="itemControlCardDimensions" @click="emit('click')">
		<div class="flex-1">
			<slot>
				<Text>{{ props.content }}</Text>
			</slot>
		</div>
		<Button
			variant="icon"
			:aria-label="$t('molecules.itemControlCard.deleteButton.label')"
			@click.stop="emit('action')">
			<TrashIcon />
		</Button>
	</div>
</template>
<script setup lang="ts">
import { itemControlCardDimensions, itemControlCardStyle } from './ItemControlCard.styles';

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
