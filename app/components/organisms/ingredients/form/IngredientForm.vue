<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor
				:to="localePath('/ingredients')"
				class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.ingredientForm.backLink') }}
			</Anchor>
			<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
			<Text class="text-content-muted">{{ $t('organisms.ingredientForm.description') }}</Text>
		</header>

		<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
			<div class="flex flex-col gap-6">
				<FormSection
					:title="$t('organisms.ingredientForm.namesSection.title')"
					:description="$t('organisms.ingredientForm.namesSection.description')">
					<!-- Stacked with a divider on mobile, side by side from tablet up. -->
					<div
						class="grid grid-cols-1 divide-y divide-stroke tablet:grid-cols-2 tablet:gap-6 tablet:divide-y-0">
						<div
							v-for="lang in languages"
							:key="lang"
							class="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 tablet:py-0">
							<h3
								class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
								{{ $t(`languages.${lang}`) }}
							</h3>
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
									:has-error="!!checkError(`translations.${lang}.name`)"
									@blur="validateForm" />
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.name`)" />
								</template>
							</InputWrapper>
						</div>
					</div>
				</FormSection>

				<FormSection
					:title="$t('organisms.ingredientForm.classificationSection.title')"
					:description="$t('organisms.ingredientForm.classificationSection.description')">
					<div class="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-start">
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
								:options="mapToSelectOptions(categoryOptions, locale)"
								infinite-scroll
								:loading="categoryLoading"
								:has-error="!!checkError(`categoryId`)"
								@update:model-value="handleCategorySelect"
								@load-more="categoryLoadNextPage"
								@blur="validateForm" />
							<template #error>
								<ErrorMessage :value="checkError(`categoryId`)" />
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
								:options="mapToSelectOptions(unitOptions, locale)"
								infinite-scroll
								:loading="unitLoading"
								:has-error="!!checkError(`unitIds`)"
								@update:model-value="handleUnitSelect"
								@load-more="unitLoadNextPage"
								@blur="validateForm" />
							<template #error>
								<ErrorMessage :value="checkError(`unitIds`)" />
							</template>
						</InputWrapper>
					</div>

					<div
						class="rounded-md bg-accent-subtle px-4 py-3"
						data-testid="ingredient-preview">
						<p
							class="text-caption font-bold uppercase tracking-wide text-accent-content">
							{{ $t('organisms.ingredientForm.preview.label') }}
						</p>
						<Text v-if="previewItems.length" class="mt-1 font-medium">
							{{ previewItems.join(' · ') }}
						</Text>
						<Text v-else class="mt-1 text-body-sm text-content-muted">
							{{ $t('organisms.ingredientForm.preview.empty') }}
						</Text>
					</div>
				</FormSection>
			</div>

			<template #buttons>
				<div
					class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-end">
					<Button variant="secondary" class="tablet:w-44" @click="handleCancelButton">
						{{ $t('organisms.ingredientForm.cancelButton') }}
					</Button>
					<Button type="submit" class="tablet:w-44">{{ props.submitLabel }}</Button>
				</div>
			</template>
		</Form>
	</div>
</template>

<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import { languages } from '~/domain/shared/translations.constants';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { Unit } from '~/domain/unit/unit.entity';
import type { IngredientForm } from '~/types/ingredient.types';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import { getIngredientPreviewItems, getPrimaryUnit } from '~/helpers/ingredient.helpers';
import { mapIngredientToForm } from '~/mappers/ingredient.mappers';

const props = defineProps({
	ingredient: { type: Object as PropType<Ingredient>, default: undefined },
	title: { type: String, required: true },
	submitLabel: { type: String, required: true }
});

const emit = defineEmits<{
	(e: 'submit', value: IngredientForm): void;
	(e: 'cancel'): void;
}>();

const { t, locale } = useI18n();
const localePath = useLocalePath();
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

/**
 * The whole selected unit, kept apart from the select options because those are
 * replaced on every new search. The preview needs its symbol, spacing and names.
 */
const selectedUnit = ref<Unit | undefined>(
	props.ingredient ? getPrimaryUnit(props.ingredient) : undefined
);

if (props.ingredient) {
	updateFormState(mapIngredientToForm(props.ingredient));
	categorySelected.value = {
		value: props.ingredient.category.id,
		label: props.ingredient.category.translations[locale.value].name
	};
	if (selectedUnit.value) {
		unitSelected.value = {
			value: selectedUnit.value.id,
			label: selectedUnit.value.translations[locale.value].name
		};
	}
}

// How the ingredient will read on a drink page, in the interface language.
const previewItems = computed(() =>
	getIngredientPreviewItems(
		formState.value.form.translations[locale.value].name,
		selectedUnit.value,
		locale.value,
		t('drinkDetailPage.ingredients.ofPreposition')
	)
);

const handleCategorySelect = (option: InputSelectOption) => {
	formState.value.form.categoryId = option.value;
};

const handleUnitSelect = (option: InputSelectOption) => {
	// The form edits the first allowed unit and keeps the others as they are.
	formState.value.form.unitIds = [option.value, ...formState.value.form.unitIds.slice(1)];
	selectedUnit.value = unitOptions.value.find((unit) => unit.id === option.value);
};

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
