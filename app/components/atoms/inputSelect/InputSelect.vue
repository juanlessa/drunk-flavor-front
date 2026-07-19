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
				class="w-full dark:bg-gray-800 bg-gray-200 border-gray-200 dark:border-gray-800 rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
				:style="{ width: 'var(--radix-select-trigger-width)' }"
				side="bottom"
				:side-offset="3"
				position="popper">
				<Select.Viewport class="p-1">
					<Select.Group>
						<Select.Item
							v-for="(option, index) in props.options"
							:key="index"
							class="text-md text-black dark:text-white rounded-md flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-gray-500 data-[disabled]:pointer-events-none data-[highlighted]:outline-hidden data-[highlighted]:bg-blue-700 data-[highlighted]:text-white"
							:value="option.value">
							<Select.ItemIndicator
								class="absolute left-0 w-[25px] inline-flex items-center justify-center">
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
	base: 'w-full inline-flex items-center justify-between gap-2 rounded-md px-3 py-1 text-md leading-base box-border border-2 outline-hidden text-black dark:text-white bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-800 focus:border-black focus:dark:border-white data-[placeholder]:text-gray-500 ',
	variants: {
		border: {
			true: 'border-gray-300 dark:border-gray-700'
		},
		hasError: {
			true: 'border-red-400 dark:border-red-600'
		}
	}
});
</script>
