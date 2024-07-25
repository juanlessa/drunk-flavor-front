<template>
	<div class="relative w-full flex-1">
		<div
			v-bind="getRootProps()"
			class="w-full p-6 pb-16 pt-6 flex flex-col items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-md">
			<input v-bind="getInputProps()" />
			<Text v-if="isDragActive" size="sm">{{ $t('dropZone.drop.message') }}</Text>
			<Text v-else size="sm">{{ $t('dropZone.drag.message') }}</Text>
			<Text size="sm">{{ $t('dropZone.or.message') }}</Text>
		</div>
		<Button
			class="absolute bottom-6 left-1/2 transform -translate-x-1/2"
			variant="outline"
			size="sm"
			@click="open">
			{{ $t('dropZone.selectFile.message') }}
		</Button>
		<div class="drag-drop-label">
			<p v-if="file">{{ file.name }}</p>
			<CloseIcon v-if="file" class="cursor-pointer" @click="handleClear" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useDropzone, type FileRejectReason } from 'vue3-dropzone';

const emit = defineEmits<{
	(e: 'file', value: File | undefined): void;
}>();

const file = ref<File>();

const onDrop = (acceptedFiles: File[], _rejectReasons: FileRejectReason[]) => {
	if (acceptedFiles.length === 1) {
		file.value = acceptedFiles[0];
		emit('file', file.value);
	}
};

const handleClear = () => {
	file.value = undefined;
	emit('file', file.value);
};

const options = reactive({
	multiple: false,
	onDrop,
	accept: 'image/*'
});

const { getRootProps, getInputProps, isDragActive, open } = useDropzone(options);
</script>
