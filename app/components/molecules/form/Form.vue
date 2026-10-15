<template>
	<Box as="form" direction="col" class="gap-10" novalidate @submit.prevent="emit('submit')">
		<template v-if="$slots.title || props.title">
			<slot name="title">
				<Heading as="h1" class="text-center text-headline-sm">{{ props.title }}</Heading>
			</slot>
		</template>
		<Box direction="col">
			<slot></slot>
		</Box>
		<slot name="buttons">
			<ButtonGroup
				:cancel-button-props="props.cancelButtonProps"
				:action-button-props="{ ...props.actionButtonProps, type: 'submit' }"
				@cancel="emit('cancel')" />
		</slot>
	</Box>
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
