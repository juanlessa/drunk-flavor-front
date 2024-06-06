<template>
	<form @submit.prevent="emit('submit')">
		<slot></slot>

		<slot name="buttons">
			<ButtonGroup :action-button-props="submitButtonProps" @cancel="emit('cancel')" />
		</slot>
	</form>
</template>
<script setup lang="ts">
import type { ButtonProps } from '~/components/atoms/button/Button.types';

const submitButtonProps: ButtonProps = { variant: 'primary', type: 'submit' };

const emit = defineEmits<{
	(e: 'submit' | 'cancel'): void;
}>();
</script>
