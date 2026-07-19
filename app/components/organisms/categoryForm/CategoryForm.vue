<template>
	<Form
		:title="$t('organisms.categoryForm.title')"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
		<div class="flex flex-col tablet:flex-row gap-4">
			<GroupWrapper
				v-for="lang in languages"
				:key="lang"
				class="flex-1"
				:title="$t(`languages.${lang}`)">
				<InputWrapper>
					<template #label>
						<Label :for="`${lang}-name`">
							{{ $t('organisms.categoryForm.nameInput.label') }}
						</Label>
					</template>
					<InputText
						:id="`${lang}-name`"
						v-model="formState.form.translations[lang].name"
						:name="`${lang}_name`"
						type="text"
						pattern=".{1,}"
						:placeholder="$t('organisms.categoryForm.nameInput.placeholder')"
						:has-error="!!checkError(`translations.${lang}.name`)"
						@blur="validateForm" />
					<template #error>
						<ErrorMessage :value="checkError(`translations.${lang}.name`)" />
					</template>
				</InputWrapper>
			</GroupWrapper>
		</div>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';
import type { CategoryForm } from '~/types/category.types';

const props = defineProps({
	categoryForm: { type: Object as PropType<CategoryForm>, default: undefined }
});
const emit = defineEmits<{
	(e: 'submit', value: CategoryForm): void;
	(e: 'cancel'): void;
}>();

const { formState, updateFormState, checkError, validateForm } = useCategoryForm();

if (props.categoryForm) {
	updateFormState(props.categoryForm);
}

const handleCancelButton = () => {
	emit('cancel');
};
const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();
	if (formState.value.errors.length !== 0) {
		return;
	}

	emit('submit', formState.value.form);
};
</script>
