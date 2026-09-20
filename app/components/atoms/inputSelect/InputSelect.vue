<template>
	<Select.Root
		v-model:open="openDropdown"
		:model-value="_modelValue"
		:name="props.name"
		@update:model-value="handleUpdate">
		<Select.Trigger
			:id="props.id"
			:class="selectInputContainerStyle({ hasError: props.hasError, border: props.border })"
			aria-label="Customise options">
			<Select.Value :placeholder="props.placeholder" />
			<Select.Icon as-child>
				<ChevronDownIcon />
			</Select.Icon>
		</Select.Trigger>

		<Select.Portal>
			<Select.Content
				class="w-full bg-surface-overlay rounded-overlay shadow-overlay will-change-[opacity,transform] data-[side=top]:animate-floating-enter-from-top data-[side=right]:animate-floating-enter-from-right data-[side=bottom]:animate-floating-enter-from-bottom data-[side=left]:animate-floating-enter-from-left z-dropdown"
				:style="{ width: 'var(--radix-select-trigger-width)' }"
				side="bottom"
				:side-offset="FLOATING_POSITION_PX.selectSideOffset"
				position="popper">
				<Select.Viewport class="p-1">
					<Select.Group>
						<Select.Item
							v-for="(option, index) in props.options"
							:key="index"
							class="text-body text-content rounded-option flex items-center h-option-control option-control-insets relative select-none data-[disabled]:text-content-subtle data-[disabled]:pointer-events-none data-[highlighted]:outline-hidden data-[highlighted]:bg-accent-strong data-[highlighted]:text-content-on-accent"
							:value="option.value">
							<Select.ItemIndicator class="option-indicator-layout">
							</Select.ItemIndicator>
							<Select.ItemText>
								{{ option.label }}
							</Select.ItemText>
						</Select.Item>
					</Select.Group>
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
</template>
<script setup lang="ts">
import { Select } from 'radix-vue/namespaced';
import { tv } from 'tailwind-variants';
import { FLOATING_POSITION_PX } from '~/constants/floatingPosition.constants';
import type { InputSelectOption } from './InputSelect.types';

const props = defineProps({
	modelValue: { type: String, default: '' },
	options: { type: Array as PropType<InputSelectOption[]>, required: true },
	placeholder: { type: String, default: '' },
	id: { type: String, default: '' },
	name: { type: String, default: '' },
	border: { type: Boolean, default: false },
	hasError: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();

const openDropdown = ref();
const _modelValue = ref<string>(props.modelValue);

watch(
	() => props.modelValue,
	(newValue) => (_modelValue.value = newValue)
);

const handleUpdate = (value: string) => {
	_modelValue.value = value;
	emit('update:modelValue', value);
	emit('blur');
};

const selectInputContainerStyle = tv({
	base: 'w-full inline-flex items-center justify-between gap-2 rounded-control px-3 py-1 text-body box-border control-border-width outline-hidden text-content bg-surface-input border-surface-input focus:border-stroke-strong data-[placeholder]:text-content-muted',
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
