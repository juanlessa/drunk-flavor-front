<template>
	<div>
		<div class="pl-2 mb-1">
			<slot name="label">
				<Label :for="props.labelFor ? props.labelFor : props.id">
					{{ props.label }}
				</Label>
			</slot>
		</div>

		<slot>
			<TextInput
				:id="props.id"
				:model-value="props.modelValue"
				:type="props.type"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				:border="props.border"
				:suffix="props.suffix"
				:suffix-outside="props.suffixOutside"
				:has-error="props.hasError"
				@update:model-value="(value: string | number) => emit('update:modelValue', value)"
				@blur="emit('blur')" />
		</slot>
		<div v-show="hasError" class="pl-2">
			<slot name="error">
				<ErrorMessage v-show="props.errorMessage" :value="props.errorMessage" />
			</slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { TextInputType } from '~/types/TextInput';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	type: { type: String as PropType<TextInputType>, default: 'text' },
	id: { type: String, default: undefined },
	name: { type: String, default: undefined },
	placeholder: { type: String, default: undefined },
	pattern: { type: String, default: undefined },
	label: { type: String, default: '' },
	labelFor: { type: String, default: '' },
	hasError: { type: Boolean, default: false },
	errorMessage: { type: String, default: '' },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	border: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number): void;
	(e: 'blur'): void;
}>();
</script>
