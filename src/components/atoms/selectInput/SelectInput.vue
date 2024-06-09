<template>
	<SelectRoot
		:id="props.id"
		v-model:open="openDropdown"
		:model-value="_modelValue"
		@update:model-value="handleUpdate">
		<SelectTrigger
			:id="props.id"
			:name="props.name"
			:class="selectInputContainerStyle({ hasError: props.hasError, border: props.border })"
			aria-label="Customise options">
			<SelectValue :placeholder="props.placeholder" />
			<ChevronDownIcon />
		</SelectTrigger>

		<SelectPortal>
			<SelectContent
				class="w-full dark:bg-gray-800 bg-gray-200 border-gray-200 dark:border-gray-800 rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
				:style="{ width: 'var(--radix-select-trigger-width)' }"
				side="bottom"
				:side-offset="3"
				position="popper">
				<SelectViewport class="p-1">
					<SelectGroup>
						<SelectItem
							v-for="(option, index) in props.options"
							:key="index"
							class="text-md text-black dark:text-white rounded-md flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-gray-500 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-700 data-[highlighted]:text-white"
							:value="option.value">
							<SelectItemIndicator
								class="absolute left-0 w-[25px] inline-flex items-center justify-center">
							</SelectItemIndicator>
							<SelectItemText>
								{{ option.label }}
							</SelectItemText>
						</SelectItem>
					</SelectGroup>
				</SelectViewport>
			</SelectContent>
		</SelectPortal>
	</SelectRoot>
</template>
<script setup lang="ts">
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectPortal,
	SelectRoot,
	SelectTrigger,
	SelectValue,
	SelectViewport
} from 'radix-vue';
import { tv } from 'tailwind-variants';
import type { SelectInputOption } from './SelectInput.types';

const selectInputContainerStyle = tv({
	base: 'w-full inline-flex items-center justify-between gap-2 rounded-md px-3 py-1 text-md leading-base box-border border-2 outline-none  text-black dark:text-white bg-gray-200 border-gray-200 dark:bg-gray-800 dark:border-gray-800 focus:border-black focus:dark:border-white data-[placeholder]:text-gray-500 ',
	variants: {
		border: {
			true: 'border-gray-300 dark:border-gray-700'
		},
		hasError: {
			true: 'border-red-400 dark:border-red-600'
		}
	}
});

const props = defineProps({
	modelValue: { type: String, default: '' },
	options: { type: Array as PropType<SelectInputOption[]>, required: true },
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

const handleUpdate = (value: string) => {
	_modelValue.value = value;
	emit('update:modelValue', value);
	emit('blur');
};

watch(
	() => props.modelValue,
	(newValue) => (_modelValue.value = newValue)
);
</script>
