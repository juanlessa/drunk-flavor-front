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
		<GroupWrapper
			:title="$t('organisms.ingredientForm.generalSection.title')"
			class="flex flex-row gap-2">
			<InputSwitch />
			<div class="flex-1">
				<Label for="categories">label</Label>
				<InputSearchableSelect
					id="categories"
					v-model="selectedCategoryComputed"
					:options="[
						{ label: 'gin', value: '1111' },
						{ label: 'vodka', value: '2222' }
					]" />
			</div>
		</GroupWrapper>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/constants/translations';
import type { InputSelectOption } from '~/types/InputSelect';
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

const selectedCategoryComputed = computed<InputSelectOption>({
	get: () => {
		const value = formState.value.form.category_id;
		const label = '';
		return { label, value };
	},
	set: (newOption) => {
		formState.value.form.category_id = newOption.value;
	}
});

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
