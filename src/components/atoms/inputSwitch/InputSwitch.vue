<template>
	<Switch.Root
		:id="props.id"
		:name="props.name"
		:checked="_checked"
		:value="props.value"
		:required="props.required"
		class="w-14 h-8 focus-within:outline flex bg-gray-200 dark:bg-gray-800 focus-within:outline-black dark:focus-within:outline-white shadow-xs rounded-full relative data-[state=checked]:bg-blue-700 cursor-default"
		@update:checked="handleUpdateChecked">
		<Switch.Thumb
			class="block w-6 h-6 my-auto bg-white shadow-xs rounded-full transition-transform duration-100 translate-x-1 will-change-transform data-[state=checked]:translate-x-7" />
	</Switch.Root>
</template>
<script setup lang="ts">
import { Switch } from 'radix-vue/namespaced';

const props = defineProps({
	checked: { type: Boolean, default: false },
	name: { type: String, default: undefined },
	id: { type: String, default: undefined },
	value: { type: String, default: undefined },
	required: { type: Boolean, default: undefined },
	disabled: { type: Boolean, default: undefined }
});
const emit = defineEmits<{
	(e: 'update:checked', value: boolean): void;
}>();

const _checked = ref(props.checked);

const handleUpdateChecked = (value: boolean) => {
	_checked.value = value;
	emit('update:checked', value);
};

watch(
	() => props.checked,
	(newValue) => (_checked.value = newValue)
);
</script>
