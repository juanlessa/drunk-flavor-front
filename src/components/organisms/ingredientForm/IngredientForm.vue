<template>
	<Form
		:title="$t('organisms.ingredientForm.title')"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
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
					:label="$t('organisms.ingredientForm.nameInput.label')"
					:placeholder="$t('organisms.ingredientForm.nameInput.placeholder')"
					:has-error="!!checkError(`translations.${lang}.name`)"
					:error-message="checkError(`translations.${lang}.name`)"
					@blur="validateForm" />
			</GroupWrapper>
		</div>
		<GroupWrapper :title="$t('organisms.ingredientForm.generalSection.title')">
			<SwitchInput />
		</GroupWrapper>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/constants/translations';
import type { IngredientForm } from '~/types/ingredient';

const props = defineProps({
	ingredientForm: { type: Object as PropType<IngredientForm>, default: undefined }
});
const emit = defineEmits<{
	(e: 'submit', value: IngredientForm): void;
	(e: 'cancel'): void;
}>();

const { formState, updateFormState, checkError, validateForm } = useIngredientForm();

if (props.ingredientForm) {
	updateFormState(props.ingredientForm);
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
