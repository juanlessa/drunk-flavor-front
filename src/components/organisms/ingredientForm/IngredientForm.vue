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
				<InputGroup
					:id="`${lang}-unit`"
					v-model="formState.form.translations[lang].unit"
					:name="`${lang}_unit`"
					type="text"
					pattern=".{1,}"
					:label="$t('organisms.ingredientForm.unitInput.label')"
					:placeholder="$t('organisms.ingredientForm.unitInput.placeholder')"
					:has-error="!!checkError(`translations.${lang}.unit`)"
					:error-message="checkError(`translations.${lang}.unit`)"
					@blur="validateForm" />
				<InputGroup
					:id="`${lang}-unit-plural`"
					v-model="formState.form.translations[lang].unit_plural"
					:name="`${lang}_unit_plural`"
					type="text"
					pattern=".{1,}"
					:label="$t('organisms.ingredientForm.unitPluralInput.label')"
					:placeholder="$t('organisms.ingredientForm.unitPluralInput.placeholder')"
					:has-error="!!checkError(`translations.${lang}.unit_plural`)"
					:error-message="checkError(`translations.${lang}.unit_plural`)"
					@blur="validateForm" />
			</GroupWrapper>
		</div>
		<GroupWrapper
			:title="$t('organisms.ingredientForm.generalSection.title')"
			class="flex flex-row gap-4">
			<div class="flex-1">
				<Label for="categories">is alcoholic</Label>
				<InputSearchableSelect
					id="categories"
					v-model:search-term="categorySearchTerm"
					v-model="categorySelected"
					:options="mapToSelectOptions(categoryOptions, $i18n.locale as Language)"
					infinite-scroll
					:loading="categoryLoading"
					@update:model-value="(opt) => (formState.form.category_id = opt.value)"
					@load-more="categoryLoadNextPage" />
			</div>
			<div class="flex-1 flex gap-4 items-center">
				<Label for="categories">is alcoholic</Label>
				<InputSwitch v-model:checked="formState.form.is_alcoholic" />
			</div>
		</GroupWrapper>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/constants/translations';
import type { IngredientForm } from '~/types/ingredient';
import { mapToSelectOptions } from '~/helpers/inputSelect.helpers';
import type { Language } from '~/types/translations';

const props = defineProps({
	ingredientForm: { type: Object as PropType<IngredientForm>, default: undefined }
});
const emit = defineEmits<{
	(e: 'submit', value: IngredientForm): void;
	(e: 'cancel'): void;
}>();

const { formState, updateFormState, checkError, validateForm } = useIngredientForm();
const {
	options: categoryOptions,
	searchTerm: categorySearchTerm,
	loading: categoryLoading,
	selected: categorySelected,
	loadNextPage: categoryLoadNextPage
} = useCategorySearchableSelect();

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
