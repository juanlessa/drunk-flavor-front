<template>
	<ReadOnlyFormView
		v-if="ingredient && canUpdate === false"
		:title="ingredient.translations[locale].name"
		:back-to="localePath('/ingredients')"
		:back-label="$t('organisms.ingredientForm.backLink')"
		@back="$router.push(localePath('/ingredients'))">
		<!-- Mirrors IngredientForm: the same sections, texts and spacing, with values instead of inputs. -->
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
					<h3 class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
						{{ $t(`languages.${lang}`) }}
					</h3>
					<dl class="flex flex-col gap-4">
						<ReadOnlyInput
							:label="$t('organisms.ingredientForm.nameInput.label')"
							:value="ingredient.translations[lang].name" />
						<!-- Asked for by the form only while a unit is written with the ingredient name. -->
						<ReadOnlyInput
							v-if="requiresNamePlural"
							:label="$t('organisms.ingredientForm.namePluralInput.label')"
							:value="ingredient.translations[lang].namePlural ?? ''"
							:help="$t('organisms.ingredientForm.namePluralInput.help')" />
						<!-- The form's character counter is only useful while typing. -->
						<ReadOnlyInput
							:label="$t('organisms.ingredientForm.descriptionInput.label')"
							:value="ingredient.translations[lang].description ?? ''"
							:help="$t('organisms.ingredientForm.descriptionInput.help')" />
						<ReadOnlyInput
							v-if="isGenderedLanguage(lang)"
							:label="$t('molecules.genderField.label')"
							:value="genderLabel(ingredient.translations[lang].gender)"
							:help="$t('molecules.genderField.help')" />
					</dl>
				</div>
			</div>
		</FormSection>

		<FormSection
			:title="$t('organisms.ingredientForm.typeSection.title')"
			:description="$t('organisms.ingredientForm.typeSection.description')">
			<ReadOnlyChoiceCards
				:model-value="ingredient.kind"
				:options="kindOptions"
				:label="$t('organisms.ingredientForm.kindInput.legend')" />
			<dl v-if="ingredient.kind === IngredientKinds.branded">
				<ReadOnlyInput
					:label="$t('organisms.ingredientForm.brandInput.label')"
					:value="ingredient.brand ?? ''"
					:help="$t('organisms.ingredientForm.brandInput.help')" />
			</dl>
		</FormSection>

		<FormSection
			:title="$t('organisms.ingredientForm.classificationSection.title')"
			:description="$t('organisms.ingredientForm.classificationSection.description')">
			<div class="flex items-center justify-between gap-4" data-testid="toggle-measurable">
				<div class="min-w-0">
					<p class="text-body font-regular text-content">
						{{ $t('organisms.ingredientForm.measurableInput.label') }}
					</p>
					<Text class="text-body-sm text-content-muted">
						{{ $t('organisms.ingredientForm.measurableInput.help') }}
					</Text>
				</div>
				<ReadOnlySwitch :checked="measurable" />
			</div>
			<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-start">
				<ReadOnlyInput
					:label="$t('organisms.ingredientForm.categoryInput.label')"
					:value="ingredient.category.translations[locale].name" />
				<ReadOnlyInput
					v-if="measurable"
					:label="$t('organisms.ingredientForm.unitsSelection.label')"
					data-testid="units-field">
					<!-- The default unit takes the place of the input value; the others follow, as in the form. -->
					<span
						class="inline-flex flex-wrap items-center gap-2"
						data-testid="default-unit">
						<span>1. {{ nameOf(defaultUnit!) }}</span>
						<Badge
							tone="accent"
							:value="$t('organisms.ingredientForm.unitsSelection.defaultBadge')" />
					</span>
					<template v-if="otherUnits.length" #after>
						<ol
							class="flex flex-col gap-2"
							:aria-label="$t('organisms.ingredientForm.unitsSelection.label')"
							data-testid="other-units">
							<li
								v-for="(unit, index) in otherUnits"
								:key="unit.id"
								class="rounded-md border border-stroke bg-surface p-3">
								<!-- The same text style as the default unit, in the value above. -->
								<p class="truncate text-body font-regular text-content">
									{{ index + 2 }}. {{ nameOf(unit) }}
								</p>
							</li>
						</ol>
					</template>
				</ReadOnlyInput>
				<ReadOnlyInput
					v-else
					:label="$t('organisms.ingredientForm.unitInput.label')"
					:value="$t('organisms.ingredientForm.unitInput.none')" />
			</dl>
			<div class="rounded-md bg-accent-subtle px-4 py-3" data-testid="ingredient-preview">
				<p class="text-caption font-bold uppercase tracking-wide text-accent-content">
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
	</ReadOnlyFormView>
</template>
<script setup lang="ts">
import type { RadioCardOption } from '~/components/molecules/radioCardGroup/RadioCardGroup.types';
import { IngredientKinds, ingredientKinds } from '~/domain/ingredient/ingredient.constants';
import { isGenderedLanguage } from '~/domain/shared/gender.helpers';
import type { Gender } from '~/domain/shared/gender.types';
import { languages } from '~/domain/shared/translations.constants';
import type { Unit } from '~/domain/unit/unit.entity';
import { getIngredientPreviewItems } from '~/helpers/ingredient.helpers';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();

// Whoever may change the ingredient has the edit form for it, so this view is only for the others.
const {
	record: ingredient,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `ingredient-view-${props.ingredientId}`,
	subject: 'Ingredient',
	fetch: () => $api.ingredients.getWithAuthorship(props.ingredientId)
});

// An ingredient without units is not measurable, as in the form.
const units = computed(() => ingredient.value?.units ?? []);
const measurable = computed(() => units.value.length > 0);
const defaultUnit = computed(() => units.value[0]);
const otherUnits = computed(() => units.value.slice(1));
const requiresNamePlural = computed(() => units.value.some((unit) => unit.useIngredientName));

// The same options as the form's kind cards.
const kindOptions = computed<RadioCardOption[]>(() =>
	ingredientKinds.map((kind) => ({
		value: kind,
		label: t(`organisms.ingredientForm.kindInput.options.${kind}.label`),
		description: t(`organisms.ingredientForm.kindInput.options.${kind}.description`)
	}))
);

const genderLabel = (gender?: Gender) =>
	gender ? t(`molecules.genderField.options.${gender}`) : '';
const nameOf = (unit: Unit) => unit.translations[locale.value].name;

// The same sample the form shows while it is filled in.
const previewItems = computed(() => {
	if (!ingredient.value) return [];
	const translation = ingredient.value.translations[locale.value];
	const name = translation.name.trim();
	if (!measurable.value) return name ? [name] : [];
	return getIngredientPreviewItems(
		name,
		defaultUnit.value,
		locale.value,
		t('drinkDetailPage.ingredients.ofPreposition'),
		translation.namePlural ?? ''
	);
});
const previewDescription = computed(
	() => ingredient.value?.translations[locale.value].description?.trim() ?? ''
);
const previewEmptyKey = computed(() =>
	measurable.value
		? 'organisms.ingredientForm.preview.emptyWithUnit'
		: 'organisms.ingredientForm.preview.empty'
);

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch ingredient:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed) $router.replace(localePath(`/ingredients/${props.ingredientId}/edit`));
	},
	{ immediate: true }
);
</script>
