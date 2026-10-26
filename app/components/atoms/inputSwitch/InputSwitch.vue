<template>
	<Switch.Root
		:id="props.id"
		:name="props.name"
		:checked="_checked"
		:value="props.value"
		:required="props.required"
		:disabled="props.disabled"
		class="w-14 h-8 flex bg-surface-input border border-stroke-input shadow-switch-track rounded-full relative data-[state=checked]:bg-accent focus-visible:outline-hidden focus-visible:shadow-focus-ring cursor-default disabled:opacity-disabled disabled:cursor-not-allowed"
		@update:checked="handleUpdateChecked">
		<Switch.Thumb
			class="block w-6 h-6 my-auto bg-content-on-accent shadow-switch-thumb rounded-full transition-transform duration-short ease-move translate-x-1 will-change-transform data-[state=checked]:translate-x-7" />
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
