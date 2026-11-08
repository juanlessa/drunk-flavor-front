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
							<InputWrapper v-if="formState.form.requiresNamePlural">
								<template #label>
									<Label :for="`${lang}-name-plural`">
										{{ $t('organisms.ingredientForm.namePluralInput.label') }}
									</Label>
								</template>
								<InputText
									:id="`${lang}-name-plural`"
									v-model="formState.form.translations[lang].namePlural"
									:name="`${lang}_namePlural`"
									type="text"
									:has-error="!!checkError(`translations.${lang}.namePlural`)"
									@blur="validateForm" />
								<Text class="text-body-sm text-content-muted">
									{{ $t('organisms.ingredientForm.namePluralInput.help') }}
								</Text>
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.namePlural`)" />
								</template>
							</InputWrapper>
							<InputWrapper>
								<template #label>
									<Label :for="`${lang}-description`">
										{{ $t('organisms.ingredientForm.descriptionInput.label') }}
									</Label>
								</template>
								<InputText
									:id="`${lang}-description`"
									v-model="formState.form.translations[lang].description"
									:name="`${lang}_description`"
									type="text"
									:has-error="!!checkError(`translations.${lang}.description`)"
									@blur="validateForm" />
								<div class="flex items-start justify-between gap-3">
									<Text class="text-body-sm text-content-muted">
										{{ $t('organisms.ingredientForm.descriptionInput.help') }}
									</Text>
									<Text
										class="shrink-0 text-body-sm tabular-nums text-content-muted">
										{{
											$t(
												'organisms.ingredientForm.descriptionInput.counter',
												{
													count: descriptionLength(lang),
													max: INGREDIENT_DESCRIPTION_MAX_LENGTH
												}
											)
										}}
									</Text>
								</div>
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.description`)" />
								</template>
							</InputWrapper>
							<GenderField
								v-if="isGenderedLanguage(lang)"
								:id="`${lang}-gender`"
								v-model="formState.form.translations[lang].gender"
								:name="`${lang}_gender`"
								:error="checkError(`translations.${lang}.gender`)"
								@blur="validateForm" />
						</div>
					</div>
				</FormSection>
				<FormSection
					:title="$t('organisms.ingredientForm.typeSection.title')"
					:description="$t('organisms.ingredientForm.typeSection.description')">
					<RadioCardGroup
						id="kind"
						name="kind"
						:label="$t('organisms.ingredientForm.kindInput.legend')"
						:model-value="formState.form.kind"
						:options="kindOptions"
						@update:model-value="handleKindUpdate" />
					<InputWrapper v-if="isBranded">
						<template #label>
							<Label for="brand">
								{{ $t('organisms.ingredientForm.brandInput.label') }}
							</Label>
						</template>
						<InputText
							id="brand"
							v-model="formState.form.brand"
							name="brand"
							type="text"
							:has-error="!!checkError('brand')"
							@blur="validateForm" />
						<Text class="text-body-sm text-content-muted">
							{{ $t('organisms.ingredientForm.brandInput.help') }}
						</Text>
						<template #error>
							<ErrorMessage :value="checkError('brand')" />
						</template>
					</InputWrapper>
				</FormSection>
				<FormSection
					:title="$t('organisms.ingredientForm.classificationSection.title')"
					:description="$t('organisms.ingredientForm.classificationSection.description')">
					<div class="flex items-center justify-between gap-4">
						<div class="min-w-0">
							<Label for="measurable">
								{{ $t('organisms.ingredientForm.measurableInput.label') }}
							</Label>
							<Text id="measurable-help" class="text-body-sm text-content-muted">
								{{ $t('organisms.ingredientForm.measurableInput.help') }}
							</Text>
						</div>
						<InputSwitch
							id="measurable"
							v-model:checked="formState.form.measurable"
							class="shrink-0"
							aria-describedby="measurable-help"
							@update:checked="handleMeasurableUpdate" />
					</div>
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
								server-filtered
								:loading="categoryLoading"
								:has-error="!!checkError(`categoryId`)"
								@update:model-value="handleCategorySelect"
								@load-more="categoryLoadNextPage"
								@blur="validateForm" />
							<template #error>
								<ErrorMessage :value="checkError(`categoryId`)" />
							</template>
						</InputWrapper>
						<UnitsSelection
							v-if="formState.form.measurable"
							:units="selectedUnits"
							:error="checkError('unitIds')"
							@update:units="handleUnitsUpdate"
							@blur="validateForm" />
						<InputWrapper v-else>
							<template #label>
								<Label for="unit-none">
									{{ $t('organisms.ingredientForm.unitInput.label') }}
								</Label>
							</template>
							<InputText
								id="unit-none"
								disabled
								model-value=""
								:placeholder="$t('organisms.ingredientForm.unitInput.none')" />
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
							{{ $t(previewEmptyKey) }}
						</Text>
						<Text
							v-if="previewItems.length && previewDescription"
							class="mt-1 text-body-sm text-content-muted">
							{{ previewDescription }}
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
import {
	INGREDIENT_DESCRIPTION_MAX_LENGTH,
	IngredientKinds,
	ingredientKinds
} from '~/domain/ingredient/ingredient.constants';
import type { Ingredient, IngredientKind } from '~/domain/ingredient/ingredient.entity';
import { isGenderedLanguage } from '~/domain/shared/gender.helpers';
import { languages } from '~/domain/shared/translations.constants';
import type { Language } from '~/domain/shared/translations.types';
import type { Unit } from '~/domain/unit/unit.entity';
import type { IngredientForm } from '~/types/ingredient.types';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { mapToSelectOptions } from '~/components/atoms/inputSelect/InputSelect.helpers';
import type { RadioCardOption } from '~/components/molecules/radioCardGroup/RadioCardGroup.types';
import { getIngredientPreviewItems } from '~/helpers/ingredient.helpers';
import { mapIngredientToForm } from '~/mappers/ingredient.mappers';
import UnitsSelection from '../unitsSelection/UnitsSelection.vue';

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

/**
 * The whole units picked, in order. The form only keeps their ids; the list and the preview need the names,
 * symbols and spacing, which are not in the options of the select because those are replaced on every search.
 */
const selectedUnits = ref<Unit[]>(props.ingredient ? [...props.ingredient.units] : []);

if (props.ingredient) {
	updateFormState(mapIngredientToForm(props.ingredient));
	categorySelected.value = {
		value: props.ingredient.category.id,
		label: props.ingredient.category.translations[locale.value].name
	};
}

const isBranded = computed(() => formState.value.form.kind === IngredientKinds.branded);

// The kind values are fixed English identifiers; only the labels are translated.
const kindOptions = computed<RadioCardOption[]>(() =>
	ingredientKinds.map((kind) => ({
		value: kind,
		label: t(`organisms.ingredientForm.kindInput.options.${kind}.label`),
		description: t(`organisms.ingredientForm.kindInput.options.${kind}.description`)
	}))
);

const isIngredientKind = (value: string): value is IngredientKind =>
	(ingredientKinds as readonly string[]).includes(value);

const descriptionLength = (lang: Language) =>
	(formState.value.form.translations[lang].description ?? '').length;

// How the ingredient will read in a drink, in the interface language. Without units it is only its name.
const previewItems = computed(() => {
	const name = formState.value.form.translations[locale.value].name;
	if (!formState.value.form.measurable) return name.trim() ? [name.trim()] : [];
	return getIngredientPreviewItems(
		name,
		selectedUnits.value[0],
		locale.value,
		t('drinkDetailPage.ingredients.ofPreposition'),
		formState.value.form.translations[locale.value].namePlural ?? ''
	);
});
const previewDescription = computed(
	() => formState.value.form.translations[locale.value].description?.trim() ?? ''
);
const previewEmptyKey = computed(() =>
	formState.value.form.measurable
		? 'organisms.ingredientForm.preview.emptyWithUnit'
		: 'organisms.ingredientForm.preview.empty'
);

const handleKindUpdate = (value: string) => {
	if (isIngredientKind(value)) {
		formState.value.form.kind = value;
		validateForm();
	}
};
const handleCategorySelect = (option: InputSelectOption) => {
	formState.value.form.categoryId = option.value;
};
// The plural name is only asked for while a unit written with the ingredient name ("3 limes") is in use.
const syncRequiresNamePlural = () => {
	formState.value.form.requiresNamePlural =
		formState.value.form.measurable &&
		selectedUnits.value.some((unit) => unit.useIngredientName === true);
};
const handleUnitsUpdate = (units: Unit[]) => {
	selectedUnits.value = units;
	formState.value.form.unitIds = units.map((unit) => unit.id);
	syncRequiresNamePlural();
	validateForm();
};
const handleMeasurableUpdate = () => {
	syncRequiresNamePlural();
	validateForm();
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
