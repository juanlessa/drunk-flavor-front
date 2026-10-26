<template>
	<div class="w-full flex items-center gap-3">
		<div :class="inputTextContainerStyle({ hasError: props.hasError, border: props.border })">
			<input
				:id="props.id"
				:value="props.modelValue"
				class="flex-1 py-1 text-body font-regular outline-hidden border-none text-content bg-transparent placeholder-content-muted"
				:type="props.type"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				@input="handleUpdateInput"
				@blur="handleBlurInput" />
			<div v-if="props.suffix && !props.suffixOutside" class="text-body text-content-muted">
				{{ props.suffix }}
			</div>
		</div>
		<div v-if="props.suffix && props.suffixOutside" class="text-body text-content-muted">
			{{ props.suffix }}
		</div>
	</div>
</template>
<script setup lang="ts">
import { tv } from '~/utils/tv';
import type { InputTextType } from './InputText.types';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	type: { type: String as PropType<InputTextType>, default: 'text' },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const handleUpdateInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const handleBlurInput = (event: Event) => {
	const target = event?.target as HTMLInputElement;
	emit('update:modelValue', target.value);
	emit('blur');
};

const inputTextContainerStyle = tv({
	base: 'flex-1 flex items-center gap-2 px-3 rounded-control box-border control-border-width bg-surface-input border-stroke-input input-container-focus-border',
	variants: {
		border: {
			true: 'border-stroke-control'
		},
		hasError: {
			true: 'border-danger-stroke'
		}
	}
});
</script>
<style scoped>
@reference "~/styles/global.css";

.input-container-focus-border:has(> input:focus) {
	@apply border-focus-ring;
}
</style>
