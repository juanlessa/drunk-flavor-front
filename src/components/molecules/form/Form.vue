<template>
	<form class="flex flex-col gap-10" @submit.prevent="emit('submit')">
		<div v-if="$slots.title || props.title">
			<slot name="title">
				<Heading class="text-center" type="h1" size="lg">{{ props.title }}</Heading>
			</slot>
		</div>
		<div>
			<slot></slot>
		</div>
		<slot name="buttons">
			<ButtonGroup
				:cancel-button-props="props.cancelButtonProps"
				:action-button-props="{ ...props.actionButtonProps, type: 'submit' }"
				@cancel="emit('cancel')" />
		</slot>
	</form>
</template>
<script setup lang="ts">
import type { ButtonProps } from '~/components/atoms/button/Button.types';

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	actionButtonProps: {
		type: Object as PropType<ButtonProps>,
		default: () => ({ variant: 'primary' }) satisfies ButtonProps
	},
	cancelButtonProps: {
		type: Object as PropType<ButtonProps>,
		default: () => ({ variant: 'secondary' }) satisfies ButtonProps
	}
});

const emit = defineEmits<{
	(e: 'submit' | 'cancel'): void;
}>();
</script>
