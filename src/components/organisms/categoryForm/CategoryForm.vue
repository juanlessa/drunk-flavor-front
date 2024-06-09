<template>
	<Form :title="$t('organisms.categoryForm.title')" @submit="handleSubmitButton">
		<div class="flex flex-col tablet:flex-row gap-4">
			<GroupWrapper
				v-for="lang in languages"
				:key="lang"
				class="flex-1"
				:title="$t(`languages.${lang}`)">
				<InputGroup
					:id="`${lang}-name`"
					v-model="formState.form.translations[lang].name"
					:name="`${lang}_name`"
					type="text"
					pattern=".{1,}"
					:label="$t('organisms.categoryForm.nameInput.label')"
					:placeholder="$t('organisms.categoryForm.nameInput.placeholder')"
					:has-error="!!checkFieldError(formState.errors, `translations.${lang}.name`)"
					:error-message="checkFieldError(formState.errors, `translations.${lang}.name`)"
					@blur="validateForm" />
			</GroupWrapper>
		</div>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/constants/translations';
import { checkFieldError } from '~/helpers/checkFieldError';

const { getCategoryFormState, validateForm } = useCategoryForm();

const formState = getCategoryFormState();

const emit = defineEmits<{
	(e: 'submit'): void;
}>();

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	console.log(formState.value.form);

	validateForm();

	if (formState.value.errors.length !== 0) {
		return;
	}

	emit('submit');
};
</script>
