<template>
	<div :class="containerStyle({ direction: props.direction })">
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
import { tv } from '~/utils/tv';
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
	},
	direction: {
		type: String as PropType<'row' | 'column' | 'responsive'>,
		default: 'responsive'
	}
});
const emit = defineEmits<{
	(e: 'action' | 'cancel'): void;
}>();
const containerStyle = tv({
	base: 'flex gap-4 items-center justify-center',
	variants: {
		direction: {
			row: 'flex-row ',
			column: 'flex-col-reverse',
			responsive: 'flex-col-reverse tablet:flex-row'
		}
	}
});
</script>
