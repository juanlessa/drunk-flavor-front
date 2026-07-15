<template>
	<div class="w-full flex-1 flex flex-col">
		<div
			v-bind="getRootProps()"
			class="flex-1 w-full px-6 pt-4 pb-8 flex flex-col items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-md">
			<input v-bind="getInputProps()" :id="props.id" />
			<Text v-if="isDragActive" size="sm">{{ $t('molecules.dropZone.drop.message') }}</Text>
			<Text v-else size="sm">{{ $t('molecules.dropZone.drag.message') }}</Text>
			<Text size="sm">{{ $t('molecules.dropZone.or.message') }}</Text>
			<Button variant="outline" size="sm">
				{{ $t('molecules.dropZone.selectFile.message') }}
			</Button>
		</div>

		<div class="drag-drop-label">
			<p v-if="_modelValue">{{ _modelValue.name }}</p>
			<CloseIcon v-if="_modelValue" class="cursor-pointer" @click="handleClear" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useDropzone, type FileRejectReason } from 'vue3-dropzone';

const props = defineProps({
	modelValue: {
		type: Object as PropType<File | undefined>,
		default: undefined
	},
	id: {
		type: String,
		default: undefined
	}
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: File | undefined): void;
}>();

const _modelValue = ref<File | undefined>(props.modelValue);

watch(
	() => props.modelValue,
	(newValue) => {
		_modelValue.value = newValue;
	}
);

const onDrop = (acceptedFiles: File[], _rejectReasons: FileRejectReason[]) => {
	const maxFileSize = 5 * 1024 * 1024; // 5MB in byte
	if (acceptedFiles.length === 1 && acceptedFiles[0].size < maxFileSize) {
		_modelValue.value = acceptedFiles[0];
		emit('update:modelValue', _modelValue.value);
	}
};

const handleClear = () => {
	_modelValue.value = undefined;
	emit('update:modelValue', _modelValue.value);
};

const options = reactive({
	multiple: false,
	onDrop,
	accept: 'image/*'
});

const { getRootProps, getInputProps, isDragActive } = useDropzone(options);
</script>
