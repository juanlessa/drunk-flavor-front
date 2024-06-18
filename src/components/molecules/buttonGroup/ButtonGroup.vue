<template>
	<div class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-center">
		<slot>
			<Button
				v-if="props.hasCancelButton"
				:value="$t('molecules.buttonGroup.cancelButton.value')"
				v-bind="props.cancelButtonProps"
				@click="emit('cancel')">
			</Button>
			<Button
				:value="$t('molecules.buttonGroup.actionButton.value')"
				v-bind="props.actionButtonProps"
				@click="emit('action')"></Button>
		</slot>
	</div>
</template>
<script setup lang="ts">
import type { ButtonProps } from '~/types/Button';

const props = defineProps({
	actionButtonProps: {
		type: Object as PropType<ButtonProps>,
		default: () => ({ variant: 'primary' }) satisfies ButtonProps
	},
	hasCancelButton: {
		type: Boolean,
		default: true
	},
	cancelButtonProps: {
		type: Object as PropType<ButtonProps>,
		default: () => ({ variant: 'secondary' }) satisfies ButtonProps
	}
});
const emit = defineEmits<{
	(e: 'action' | 'cancel'): void;
}>();
</script>
