<template>
	<Form
		:title="$t('organisms.categoryForm.title')"
		class="p-form-page"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
		<Box direction="col" class="gap-4">
			<Box direction="responsive" class="gap-4">
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
			</Box>
			<GroupWrapper :title="$t('organisms.categoryForm.generalSection.title')">
				<div class="grid grid-cols-1 tablet:grid-cols-2 gap-4 items-start">
					<InputWrapper direction="row">
						<template #label>
							<Label for="is-alcoholic">
								{{ $t('organisms.categoryForm.isAlcoholicInput.label') }}
							</Label>
						</template>
						<InputSwitch
							id="is-alcoholic"
							v-model:checked="formState.form.is_alcoholic" />
					</InputWrapper>
				</div>
			</GroupWrapper>
		</Box>
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
