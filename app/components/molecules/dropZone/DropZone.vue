<template>
	<Box direction="col" class="flex-1">
		<Box
			ref="dropZoneRef"
			data-testid="drop-zone-area"
			direction="col"
			:class="dropZoneAreaStyle({ aspect: props.aspect, preview: !!previewSrc })"
			:tabindex="previewSrc ? 0 : undefined"
			:role="previewSrc ? 'button' : undefined"
			:aria-label="previewSrc ? $t('molecules.dropZone.replace.label') : undefined"
			@click="openFilePicker"
			@keydown.enter.prevent="previewSrc && openFilePicker()"
			@keydown.space.prevent="previewSrc && openFilePicker()">
			<input
				:id="props.id"
				ref="fileInputRef"
				type="file"
				:accept="props.accept.join(',')"
				class="hidden"
				@change="handleFileInput" />
			<!-- The chosen file (or the current image) replaces the prompt; clicking still picks another file. -->
			<img
				v-if="previewSrc"
				:src="previewSrc"
				:alt="props.previewAlt"
				data-testid="drop-zone-preview"
				class="size-full rounded-[inherit] object-cover" />
			<template v-else>
				<!-- text-center keeps the prompt centered when it wraps in narrow (square) areas. -->
				<Text v-if="isOverDropZone" class="text-body-sm text-center">{{
					$t('molecules.dropZone.drop.message')
				}}</Text>
				<Text v-else class="text-body-sm text-center">{{
					$t('molecules.dropZone.drag.message')
				}}</Text>
				<Text class="text-body-sm text-center">{{
					$t('molecules.dropZone.or.message')
				}}</Text>
				<Button variant="outline" size="sm" class="cursor-pointer">
					{{ $t('molecules.dropZone.selectFile.message') }}
				</Button>
			</template>
		</Box>

		<Box direction="row" class="gap-1 items-center" :class="!_modelValue && 'invisible'">
			<Text class="min-w-0 truncate">{{ fileName }}</Text>
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
import { tv } from '~/utils/tv';
import type { DropZoneAccept, DropZoneAspect } from './DropZone.types';
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
	},
	/** Image already stored (e.g. when editing); shown until another file is chosen. */
	previewUrl: {
		type: String,
		default: ''
	},
	previewAlt: {
		type: String,
		default: ''
	},
	/** Shape of the drop area; without it the area just fills the available space. */
	aspect: {
		type: String as PropType<DropZoneAspect>,
		default: undefined
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: File | undefined): void;
}>();

const dropZoneAreaStyle = tv({
	base: 'px-6 pt-4 pb-8 items-center gap-2 bg-surface-input border border-stroke-input hover:border-stroke-control focus-within:border-focus-ring focus-visible:outline-hidden focus-visible:shadow-focus-ring rounded-dropzone cursor-pointer transition-colors duration-short',
	variants: {
		aspect: {
			square: 'w-full aspect-square justify-center',
			// Wide on mobile; on larger screens it matches the 200px square next to it.
			wide: 'w-full aspect-video justify-center tablet:aspect-auto tablet:h-50'
		},
		preview: {
			true: 'p-2'
		}
	},
	compoundVariants: [{ aspect: undefined, class: 'flex-1' }]
});

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const _modelValue = shallowRef<File | undefined>(props.modelValue);
const fileName = computed(() => _modelValue.value?.name ?? '');

// Object URL of the chosen file, released whenever the file changes or the component goes away.
const objectUrl = ref('');
const releaseObjectUrl = () => {
	if (objectUrl.value) URL.revokeObjectURL(objectUrl.value);
	objectUrl.value = '';
};
watch(
	_modelValue,
	(file) => {
		releaseObjectUrl();
		if (file && typeof URL.createObjectURL === 'function') {
			objectUrl.value = URL.createObjectURL(file);
		}
	},
	{ immediate: true }
);
onBeforeUnmount(releaseObjectUrl);

const previewSrc = computed(() => objectUrl.value || props.previewUrl);

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
