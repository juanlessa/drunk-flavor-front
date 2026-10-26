<template>
	<Form
		:title="$t('organisms.ingredientForm.title')"
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
								{{ $t('organisms.ingredientForm.nameInput.label') }}
							</Label>
						</template>
						<InputText
							:id="`${lang}-name`"
							v-model="formState.form.translations[lang].name"
							:name="`${lang}_name`"
							type="text"
							pattern=".{1,}"
							:placeholder="$t('organisms.ingredientForm.nameInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.name`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.name`)" />
						</template>
					</InputWrapper>
				</GroupWrapper>
			</Box>
			<GroupWrapper :title="$t('organisms.ingredientForm.generalSection.title')">
				<div class="grid grid-cols-1 tablet:grid-cols-2 gap-4 items-start">
					<InputWrapper>
						<template #label>
							<Label for="category">
								{{ $t('organisms.ingredientForm.categoryInput.label') }}
							</Label>
						</template>
						<InputSelectSearchable
							id="category"
							v-model="categorySelected"
							v-model:search-term="categorySearchTerm"
							:options="mapToSelectOptions(categoryOptions, $i18n.locale)"
							infinite-scroll
							:loading="categoryLoading"
							:has-error="!!checkError(`category_id`)"
							@update:model-value="(opt) => (formState.form.category_id = opt.value)"
							@load-more="categoryLoadNextPage"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`category_id`)" />
						</template>
					</InputWrapper>
					<InputWrapper>
						<template #label>
							<Label for="unit">
								{{ $t('organisms.ingredientForm.unitInput.label') }}
							</Label>
						</template>
						<InputSelectSearchable
							id="unit"
							v-model="unitSelected"
							v-model:search-term="unitSearchTerm"
							:options="mapToSelectOptions(unitOptions, $i18n.locale)"
							infinite-scroll
							:loading="unitLoading"
							:has-error="!!checkError(`unit_id`)"
							@update:model-value="(opt) => (formState.form.unit_id = opt.value)"
							@load-more="unitLoadNextPage"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`unit_id`)" />
						</template>
					</InputWrapper>
				</div>
			</GroupWrapper>
		</Box>
	</Form>
</template>

<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { IngredientForm } from '~/types/ingredient.types';
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import { mapIngredientToForm } from '~/mappers/ingredient.mappers';

const props = defineProps({
	ingredient: { type: Object as PropType<Ingredient>, default: undefined }
});

const emit = defineEmits<{
	(e: 'submit', value: IngredientForm): void;
	(e: 'cancel'): void;
}>();

const { locale } = useI18n();
const { formState, updateFormState, checkError, validateForm } = useIngredientForm();
const {
	options: categoryOptions,
	searchTerm: categorySearchTerm,
	loading: categoryLoading,
	selected: categorySelected,
	loadNextPage: categoryLoadNextPage
} = useCategorySearchableSelect();
const {
	options: unitOptions,
	searchTerm: unitSearchTerm,
	loading: unitLoading,
	selected: unitSelected,
	loadNextPage: unitLoadNextPage
} = useUnitSearchableSelect();

if (props.ingredient) {
	updateFormState(mapIngredientToForm(props.ingredient));
	categorySelected.value = {
		value: props.ingredient.category._id,
		label: props.ingredient.category.translations[locale.value].name
	};
	unitSelected.value = {
		value: props.ingredient.unit._id,
		label: props.ingredient.unit.translations[locale.value].name
	};
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
