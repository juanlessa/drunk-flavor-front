<template>
	<div class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-center">
		<slot>
			<Button v-bind="props.actionButtonProps" @click="emit('action')">enviars</Button>
			<Button
				v-if="props.hasCancelButton"
				v-bind="props.cancelButtonProps"
				@click="emit('cancel')">
				cancel
			</Button>
		</slot>
	</div>
</template>
<script setup lang="ts">
import type { ButtonProps } from '~/components/atoms/button/Button.types';

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
