<template>
	<div
		class="flex items-center justify-center gap-4 tablet:flex-col tablet:justify-start tablet:gap-2">
		<div class="relative shrink-0">
			<Avatar :src="displaySrc" :alt="props.alt" size="lg" />
			<Button
				variant="icon"
				size="sm"
				:disabled="props.disabled"
				:aria-label="props.buttonLabel"
				class="absolute -right-1 bottom-0 hidden size-8 rounded-full border-2 border-surface bg-accent text-content-on-accent shadow-sm tablet:inline-flex"
				@click="openFilePicker">
				<CameraIcon class="size-4" />
			</Button>
		</div>

		<div class="flex min-w-0 flex-col items-start gap-2 tablet:hidden">
			<Button
				variant="outline"
				size="sm"
				:disabled="props.disabled"
				:aria-label="props.buttonLabel"
				class="inline-flex items-center gap-2"
				@click="openFilePicker">
				<CameraIcon class="size-4" />
				{{ props.buttonLabel }}
			</Button>
			<Text class="text-body-sm text-content-muted">{{ props.helpText }}</Text>
		</div>

		<Text class="hidden max-w-28 text-center text-caption text-content-muted tablet:block">
			{{ props.helpText }}
		</Text>

		<input
			:id="props.id"
			ref="fileInputRef"
			type="file"
			:accept="props.accept.join(',')"
			class="sr-only"
			:disabled="props.disabled"
			@change="handleFileInput" />
	</div>
</template>

<script setup lang="ts">
import CameraIcon from '~/components/icons/CameraIcon.vue';

export type AvatarInputError = 'file-too-large' | 'unsupported-file-type';

const props = defineProps({
	modelValue: { type: Object as PropType<File | undefined>, default: undefined },
	src: { type: String, default: '' },
	alt: { type: String, required: true },
	id: { type: String, default: undefined },
	buttonLabel: { type: String, required: true },
	helpText: { type: String, required: true },
	disabled: { type: Boolean, default: false },
	maxFileSize: { type: Number, default: 3 * 1024 * 1024 },
	accept: {
		type: Array as PropType<string[]>,
		default: () => ['image/jpeg', 'image/png', 'image/webp']
	}
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: File | undefined): void;
	(e: 'invalid', value: AvatarInputError): void;
}>();

const fileInputRef = ref<HTMLInputElement>();
const previewUrl = ref('');
const displaySrc = computed(() => previewUrl.value || props.src);

const revokePreview = () => {
	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value);
		previewUrl.value = '';
	}
};

const setPreview = (file: File | undefined) => {
	revokePreview();
	if (file) previewUrl.value = URL.createObjectURL(file);
};

const handleFileInput = (event: Event) => {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = '';
	if (!file) return;
	if (!props.accept.includes(file.type)) {
		emit('invalid', 'unsupported-file-type');
		return;
	}
	if (file.size > props.maxFileSize) {
		emit('invalid', 'file-too-large');
		return;
	}
	setPreview(file);
	emit('update:modelValue', file);
};

const openFilePicker = () => fileInputRef.value?.click();

watch(() => props.modelValue, setPreview, { immediate: true });
onBeforeUnmount(revokePreview);
</script>
