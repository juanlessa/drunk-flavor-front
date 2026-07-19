<template>
	<Form
		:title="$t('organisms.ingredientForm.title')"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col tablet:flex-row gap-4">
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
					<InputWrapper>
						<template #label>
							<Label :for="`${lang}-unit`">
								{{ $t('organisms.ingredientForm.unitInput.label') }}
							</Label>
						</template>
						<InputText
							:id="`${lang}-unit`"
							v-model="formState.form.translations[lang].unit"
							:name="`${lang}_unit`"
							type="text"
							pattern=".{1,}"
							:placeholder="$t('organisms.ingredientForm.unitInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.unit`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.unit`)" />
						</template>
					</InputWrapper>
					<InputWrapper>
						<template #label>
							<Label :for="`${lang}-unit-plural`">
								{{ $t('organisms.ingredientForm.unitPluralInput.label') }}
							</Label>
						</template>
						<InputText
							:id="`${lang}-unit-plural`"
							v-model="formState.form.translations[lang].unit_plural"
							:name="`${lang}_unit_plural`"
							type="text"
							pattern=".{1,}"
							:placeholder="
								$t('organisms.ingredientForm.unitPluralInput.placeholder')
							"
							:has-error="!!checkError(`translations.${lang}.unit_plural`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.unit_plural`)" />
						</template>
					</InputWrapper>
				</GroupWrapper>
			</div>
			<GroupWrapper
				:title="$t('organisms.ingredientForm.generalSection.title')"
				class="flex flex-row gap-4">
				<InputWrapper>
					<template #label>
						<Label for="category">
							{{ $t('organisms.ingredientForm.categoryInput.label') }}
						</Label>
					</template>
					<InputSearchableSelect
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
				<InputWrapper direction="row">
					<template #label>
						<Label for="is-alcoholic">
							{{ $t('organisms.ingredientForm.isAlcoholicInput.label') }}
						</Label>
					</template>
					<InputSwitch v-model:checked="formState.form.is_alcoholic" />
				</InputWrapper>
			</GroupWrapper>
		</div>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/constants/translations';
import type { Ingredient, IngredientForm } from '~/types/ingredient';
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import { mapIngredientToForm } from '~/helpers/ingredientMappers';

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

if (props.ingredient) {
	updateFormState(mapIngredientToForm(props.ingredient));
	categorySelected.value = {
		value: props.ingredient.category._id,
		label: props.ingredient.category.translations[locale.value].name
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
