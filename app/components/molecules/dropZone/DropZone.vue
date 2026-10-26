<template>
	<Box direction="col" class="flex-1">
		<Box
			ref="dropZoneRef"
			data-testid="drop-zone-area"
			direction="col"
			class="flex-1 px-6 pt-4 pb-8 items-center gap-2 bg-surface-input border border-stroke-input hover:border-stroke-control focus-within:border-focus-ring rounded-dropzone cursor-pointer transition-colors duration-short"
			@click="openFilePicker">
			<input
				:id="props.id"
				ref="fileInputRef"
				type="file"
				:accept="props.accept.join(',')"
				class="hidden"
				@change="handleFileInput" />
			<Text v-if="isOverDropZone" class="text-body-sm">{{
				$t('molecules.dropZone.drop.message')
			}}</Text>
			<Text v-else class="text-body-sm">{{ $t('molecules.dropZone.drag.message') }}</Text>
			<Text class="text-body-sm">{{ $t('molecules.dropZone.or.message') }}</Text>
			<Button variant="outline" size="sm" class="cursor-pointer">
				{{ $t('molecules.dropZone.selectFile.message') }}
			</Button>
		</Box>

		<Box direction="row" class="gap-1 items-center" :class="!_modelValue && 'invisible'">
			<Text>{{ fileName }}</Text>
			<Button
				variant="icon"
				:aria-label="$t('molecules.dropZone.clearButton.label')"
				@click="handleClear">
				<CloseIcon />
			</Button>
		</Box>
	</Box>
</template>

<script setup lang="ts">
import { shallowRef, computed, ref } from 'vue';
import { useDropZone } from '@vueuse/core';
import type { DropZoneAccept } from './DropZone.types';
import { dropZoneImageAcceptOptions } from './DropZone.constants';

const props = defineProps({
	modelValue: {
		type: Object as PropType<File | undefined>,
		default: undefined
	},
	id: {
		type: String,
		default: undefined
	},
	/** Maximum file size in bytes (e.g. 5 * 1024 * 1024 for 5MB, 10 * 1024 * 1024 for 10MB) */
	maxFileSize: {
		type: Number,
		default: 5 * 1024 * 1024
	},
	accept: {
		type: Array as PropType<DropZoneAccept[]>,
		default: () => dropZoneImageAcceptOptions
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: File | undefined): void;
}>();

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const _modelValue = shallowRef<File | undefined>(props.modelValue);
const fileName = computed(() => _modelValue.value?.name ?? '');

watch(
	() => props.modelValue,
	(newValue) => {
		_modelValue.value = newValue;
	}
);

const handleFileDrop = (files: File[] | null) => {
	if (!files || files.length === 0) return;
	const [file] = files;
	if (!file || file.size >= props.maxFileSize) return;
	_modelValue.value = file;
	emit('update:modelValue', file);
};

const handleFileInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const files = target.files;
	if (!files || files.length === 0) return;
	const [file] = files;
	if (
		!file ||
		file.size >= props.maxFileSize ||
		!props.accept.includes(file.type as DropZoneAccept)
	)
		return;
	_modelValue.value = file;
	emit('update:modelValue', file);
	target.value = '';
};

const openFilePicker = () => {
	fileInputRef.value?.click();
};

const handleClear = () => {
	_modelValue.value = undefined;
	emit('update:modelValue', undefined);
};

const { isOverDropZone } = useDropZone(dropZoneRef, {
	dataTypes: props.accept,
	onDrop: handleFileDrop,
	multiple: false
});
</script>
