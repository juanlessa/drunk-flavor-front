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
				:value="props.modelValue"
				:type="props.type"
				:name="props.name"
				:placeholder="props.placeholder"
				:pattern="`${props.pattern}`"
				:border="props.border"
				:suffix="props.suffix"
				:suffix-outside="props.suffixOutside"
				:has-error="props.hasError"
				@input="(value: string | number) => emit('update:modelValue', value)"
				@blur="emit('blur')" />
		</slot>
		<div v-show="hasError" class="pl-2">
			<slot name="error">
				<ErrorMessage v-show="props.errorMesssage" :value="props.errorMesssage" />
			</slot>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { TextInputType } from '~/components/atoms/textInput/TextInput.types';

const props = defineProps({
	modelValue: { type: [String, Number], default: '' },
	type: { type: String as PropType<TextInputType>, default: 'text' },
	id: { type: String, default: '' },
	name: { type: String, default: '' },
	placeholder: { type: String, default: '' },
	pattern: { type: String, default: '' },
	label: { type: String, default: '' },
	labelFor: { type: String, default: '' },
	hasError: { type: Boolean, default: false },
	errorMesssage: { type: String, default: '' },
	suffix: { type: String, default: '' },
	suffixOutside: { type: Boolean, default: false },
	border: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number): void;
	(e: 'blur'): void;
}>();
</script>
