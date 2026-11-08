<template>
	<InputWrapper>
		<template #label>
			<Label :for="props.id">{{ $t('molecules.genderField.label') }}</Label>
		</template>
		<InputSelect
			:id="props.id"
			:name="props.name"
			:model-value="props.modelValue ?? ''"
			:options="options"
			:placeholder="$t('molecules.genderField.placeholder')"
			:has-error="!!props.error"
			@update:model-value="handleUpdate"
			@blur="emit('blur')" />
		<Text class="text-body-sm text-content-muted">{{ $t('molecules.genderField.help') }}</Text>
		<template #error>
			<ErrorMessage :value="props.error" />
		</template>
	</InputWrapper>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { genders } from '~/domain/shared/gender.constants';
import type { Gender } from '~/domain/shared/gender.types';

const props = defineProps({
	/** Undefined until a gender is picked. */
	modelValue: { type: String as PropType<Gender>, default: undefined },
	id: { type: String, required: true },
	name: { type: String, default: '' },
	error: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: Gender): void;
	(e: 'blur'): void;
}>();

const { t } = useI18n();

// The gender values are fixed English identifiers; only the labels are translated.
const options = computed<InputSelectOption[]>(() =>
	genders.map((gender) => ({
		label: t(`molecules.genderField.options.${gender}`),
		value: gender
	}))
);

const isGender = (value: string): value is Gender => (genders as readonly string[]).includes(value);

const handleUpdate = (value: string) => {
	if (isGender(value)) {
		emit('update:modelValue', value);
	}
};
</script>
