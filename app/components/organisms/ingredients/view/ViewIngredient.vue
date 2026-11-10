<template>
	<ReadOnlyView
		v-if="ingredient && canUpdate === false"
		:title="ingredient.translations[locale].name"
		:back-to="localePath('/ingredients')"
		:back-label="$t('organisms.ingredientForm.backLink')"
		@back="$router.push(localePath('/ingredients'))">
		<FormSection
			:title="$t('organisms.ingredientForm.namesSection.title')"
			:description="$t('organisms.ingredientForm.namesSection.description')">
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
						<ReadOnlyField
							:label="$t('organisms.ingredientForm.nameInput.label')"
							:value="ingredient.translations[lang].name" />
						<ReadOnlyField
							v-if="ingredient.translations[lang].namePlural"
							:label="$t('organisms.ingredientForm.namePluralInput.label')"
							:value="ingredient.translations[lang].namePlural" />
						<ReadOnlyField
							:label="$t('organisms.ingredientForm.descriptionInput.label')"
							:value="ingredient.translations[lang].description ?? ''" />
						<ReadOnlyField
							v-if="isGenderedLanguage(lang)"
							:label="$t('molecules.genderField.label')"
							:value="genderLabel(ingredient.translations[lang].gender)" />
					</dl>
				</div>
			</div>
		</FormSection>
		<FormSection
			:title="$t('organisms.ingredientView.detailsSection.title')"
			:description="$t('organisms.ingredientView.detailsSection.description')">
			<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-3">
				<ReadOnlyField :label="$t('organisms.ingredientForm.categoryInput.label')">
					<Badge tone="accent" :value="ingredient.category.translations[locale].name" />
				</ReadOnlyField>
				<ReadOnlyField
					:label="$t('organisms.ingredientForm.kindInput.legend')"
					:value="
						$t(`organisms.ingredientForm.kindInput.options.${ingredient.kind}.label`)
					" />
				<ReadOnlyField
					v-if="ingredient.kind === IngredientKinds.branded"
					:label="$t('organisms.ingredientForm.brandInput.label')"
					:value="ingredient.brand ?? ''" />
			</dl>
		</FormSection>
		<FormSection
			:title="$t('organisms.ingredientView.unitsSection.title')"
			:description="$t('organisms.ingredientView.unitsSection.description')">
			<dl>
				<ReadOnlyField :label="$t('organisms.ingredientView.unitsField')">
					<ol v-if="ingredient.units.length" class="flex flex-wrap gap-2">
						<li
							v-for="(unit, index) in ingredient.units"
							:key="unit.id"
							class="inline-flex items-center gap-2 rounded-md border border-stroke bg-surface px-3 py-1.5 text-body-sm">
							<span
								class="inline-flex size-5 items-center justify-center rounded-full bg-accent-subtle text-caption text-accent-content">
								{{ index + 1 }}
							</span>
							{{ unit.symbol || unit.translations[locale].name }}
						</li>
					</ol>
					<template v-else>{{ $t('organisms.ingredientView.noUnits') }}</template>
				</ReadOnlyField>
			</dl>
		</FormSection>
	</ReadOnlyView>
</template>
<script setup lang="ts">
import { IngredientKinds } from '~/domain/ingredient/ingredient.constants';
import { isGenderedLanguage } from '~/domain/shared/gender.helpers';
import type { Gender } from '~/domain/shared/gender.types';
import { languages } from '~/domain/shared/translations.constants';

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

const genderLabel = (gender?: Gender) =>
	gender ? t(`molecules.genderField.options.${gender}`) : '';

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
