<template>
	<form class="flex flex-col gap-2" novalidate @submit.prevent="handleSubmit">
		<label :for="props.id" class="sr-only">{{ props.label }}</label>
		<InputTextArea
			:id="props.id"
			ref="textAreaRef"
			:model-value="props.modelValue"
			:name="props.id"
			:rows="props.rows"
			:placeholder="props.placeholder"
			:maxlength="COMMENT_CONTENT_MAX_LENGTH"
			:aria-describedby="counterId"
			:disabled="props.isSubmitting"
			class="min-h-24 resize-y"
			@update:model-value="emit('update:modelValue', $event)"
			@keydown="handleKeydown" />
		<div class="flex flex-col gap-2 tablet:flex-row tablet:items-center">
			<Text
				:id="counterId"
				class="text-caption tablet:mr-auto"
				:class="isNearLimit ? 'text-warning' : 'text-content-muted'"
				:aria-live="isNearLimit ? 'polite' : 'off'">
				{{ counterLabel }}
			</Text>
			<!-- Two equal columns on mobile so both actions stay large; compact on wider screens. -->
			<div
				class="grid gap-2 tablet:flex tablet:justify-end"
				:class="props.cancelable ? 'grid-cols-2' : 'grid-cols-1'">
				<Button
					v-if="props.cancelable"
					variant="secondary"
					class="tablet:w-28"
					:disabled="props.isSubmitting"
					@click="emit('cancel')">
					{{ $t('drinkDetailPage.comments.cancel') }}
				</Button>
				<Button type="submit" class="tablet:w-36" :disabled="!canSubmit">
					{{
						props.isSubmitting
							? $t('drinkDetailPage.comments.saving')
							: props.submitLabel
					}}
				</Button>
			</div>
		</div>
	</form>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import {
	COMMENT_CONTENT_MAX_LENGTH,
	COMMENT_CONTENT_MIN_LENGTH
} from '~/domain/comment/comment.constants';

/** Remaining characters below which the counter turns into a warning. */
const NEAR_LIMIT_REMAINING = 200;

const props = defineProps({
	modelValue: { type: String, default: '' },
	id: { type: String, required: true },
	/** Accessible name of the text area (visually hidden). */
	label: { type: String, required: true },
	placeholder: { type: String, default: '' },
	submitLabel: { type: String, required: true },
	cancelable: { type: Boolean, default: false },
	isSubmitting: { type: Boolean, default: false },
	rows: { type: Number, default: 3 },
	/** Content the submission must differ from (the original text when editing). */
	initialValue: { type: String, default: '' }
});

const emit = defineEmits<{
	(e: 'update:modelValue' | 'submit', value: string): void;
	(e: 'cancel'): void;
}>();

const { t, n } = useI18n();
const counterId = useId();
const textAreaRef = ref<{ $el: HTMLTextAreaElement } | null>(null);

const trimmed = computed(() => props.modelValue.trim());
const remaining = computed(() => COMMENT_CONTENT_MAX_LENGTH - props.modelValue.length);
const isNearLimit = computed(() => remaining.value <= NEAR_LIMIT_REMAINING);
const counterLabel = computed(() =>
	t('drinkDetailPage.comments.counter', {
		count: n(props.modelValue.length),
		max: n(COMMENT_CONTENT_MAX_LENGTH)
	})
);
const canSubmit = computed(
	() =>
		!props.isSubmitting &&
		trimmed.value.length >= COMMENT_CONTENT_MIN_LENGTH &&
		trimmed.value.length <= COMMENT_CONTENT_MAX_LENGTH &&
		trimmed.value !== props.initialValue.trim()
);

const handleSubmit = () => {
	if (!canSubmit.value) return;
	emit('submit', trimmed.value);
};

// Ctrl/Cmd + Enter submits from a hardware keyboard; Escape cancels an edit.
const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
		event.preventDefault();
		handleSubmit();
	} else if (event.key === 'Escape' && props.cancelable) {
		event.preventDefault();
		emit('cancel');
	}
};

const focus = () => {
	const element = textAreaRef.value?.$el;
	if (!element) return;
	element.focus();
	element.setSelectionRange(element.value.length, element.value.length);
};

defineExpose({ focus });
</script>
