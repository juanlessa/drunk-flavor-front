<template>
	<ReadOnlyFormView
		v-if="unit && canUpdate === false"
		:title="unit.translations[locale].name"
		:back-to="localePath('/units')"
		:back-label="$t('organisms.unitForm.backLink')"
		@back="$router.push(localePath('/units'))">
		<!-- Mirrors UnitForm: the same sections, texts and spacing, with values instead of inputs. -->
		<FormSection
			:title="$t('organisms.unitForm.namesSection.title')"
			:description="$t('organisms.unitForm.namesSection.description')">
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
							:label="$t('organisms.unitForm.nameInput.label')"
							:value="unit.translations[lang].name" />
						<ReadOnlyInput
							:label="$t('organisms.unitForm.namePluralInput.label')"
							:value="unit.translations[lang].namePlural" />
						<ReadOnlyInput
							v-if="isGenderedLanguage(lang)"
							:label="$t('molecules.genderField.label')"
							:value="genderLabel(unit.translations[lang].gender)"
							:help="$t('molecules.genderField.help')" />
					</dl>
				</div>
			</div>
		</FormSection>

		<FormSection
			:title="$t('organisms.unitForm.formatSection.title')"
			:description="$t('organisms.unitForm.formatSection.description')">
			<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-start">
				<ReadOnlyInput
					:label="$t('organisms.unitForm.symbolInput.label')"
					:value="unit.symbol ?? ''" />
				<ReadOnlyInput
					:label="$t('organisms.unitForm.kindInput.label')"
					:value="$t(`organisms.unitForm.kindInput.options.${unit.kind}`)" />
			</dl>

			<div class="flex flex-col gap-5 border-t border-stroke pt-5">
				<div
					v-for="toggle in toggles"
					:key="toggle.field"
					class="flex items-center justify-between gap-4"
					:data-testid="`toggle-${toggle.field}`">
					<div class="min-w-0">
						<p class="text-body font-regular text-content">
							{{ $t(`organisms.unitForm.${toggle.i18nKey}.label`) }}
						</p>
						<Text class="text-body-sm text-content-muted">
							{{ $t(`organisms.unitForm.${toggle.i18nKey}.help`) }}
						</Text>
					</div>
					<ReadOnlySwitch :checked="unit[toggle.field] === true" />
				</div>
			</div>

			<div class="rounded-md bg-accent-subtle px-4 py-3" data-testid="unit-preview">
				<p class="text-caption font-bold uppercase tracking-wide text-accent-content">
					{{ $t('organisms.unitForm.preview.label') }}
				</p>
				<Text v-if="previewItems.length" class="mt-1 font-medium">
					{{ previewItems.join(' · ') }}
				</Text>
				<Text v-else class="mt-1 text-body-sm text-content-muted">
					{{ $t('organisms.unitForm.preview.empty') }}
				</Text>
			</div>
		</FormSection>
	</ReadOnlyFormView>
</template>
<script setup lang="ts">
import { isGenderedLanguage } from '~/domain/shared/gender.helpers';
import type { Gender } from '~/domain/shared/gender.types';
import { languages } from '~/domain/shared/translations.constants';
import { getUnitPreviewItems } from '~/helpers/unit.helpers';
import { mapUnitToForm } from '~/mappers/unit.mappers';

const props = defineProps({
	unitId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const toggles = [
	{ field: 'spaceBeforeSymbol', i18nKey: 'spaceBeforeSymbolInput' },
	{ field: 'allowDecimal', i18nKey: 'allowDecimalInput' },
	{ field: 'useIngredientName', i18nKey: 'useIngredientNameInput' }
] as const;

// Whoever may change the unit has the edit form for it, so this view is only for the others.
const {
	record: unit,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `unit-view-${props.unitId}`,
	subject: 'Unit',
	fetch: () => $api.units.getWithAuthorship(props.unitId)
});

const genderLabel = (gender?: Gender) =>
	gender ? t(`molecules.genderField.options.${gender}`) : '';

// The same sample the form shows while it is filled in.
const previewItems = computed(() => {
	if (!unit.value) return [];
	if (unit.value.useIngredientName) return [t('organisms.unitForm.preview.ingredientName')];
	return getUnitPreviewItems(mapUnitToForm(unit.value), locale.value);
});

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch unit:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed) $router.replace(localePath(`/units/${props.unitId}/edit`));
	},
	{ immediate: true }
);
</script>
