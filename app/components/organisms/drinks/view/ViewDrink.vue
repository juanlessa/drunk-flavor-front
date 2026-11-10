<template>
	<ReadOnlyView
		v-if="drink && canUpdate === false"
		:title="drink.translations[locale].name"
		:back-to="localePath('/drinks')"
		:back-label="$t('organisms.drinkForm.backLink')"
		@back="$router.push(localePath('/drinks'))">
		<FormSection
			:title="$t('organisms.drinkForm.namesSection.title')"
			:description="$t('organisms.drinkForm.namesSection.description')">
			<div
				class="grid grid-cols-1 divide-y divide-stroke tablet:grid-cols-2 tablet:gap-6 tablet:divide-y-0">
				<div
					v-for="lang in languages"
					:key="lang"
					class="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 tablet:py-0">
					<h3 class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
						{{ $t(`languages.${lang}`) }}
					</h3>
					<dl>
						<ReadOnlyField
							:label="$t('organisms.drinkForm.nameInput.label')"
							:value="drink.translations[lang].name" />
					</dl>
				</div>
			</div>
		</FormSection>
		<FormSection
			v-for="list in recipeLists"
			:key="list.kind"
			:title="$t(`organisms.drinkForm.${list.kind}Section.title`)"
			:description="$t(`organisms.drinkForm.${list.kind}Section.description`)">
			<ol
				v-if="list.lines.length"
				class="flex flex-col gap-2"
				:aria-label="$t(`organisms.drinkForm.${list.kind}Section.title`)">
				<li
					v-for="(line, index) in list.lines"
					:key="`${line.ingredient.id}-${index}`"
					class="flex items-start gap-3 rounded-md border border-stroke bg-surface p-3"
					data-testid="recipe-line">
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium text-content">
							{{ index + 1 }}. {{ line.ingredient.translations[locale].name }}
						</p>
						<p class="truncate text-body-sm text-content-muted">
							{{ getIngredientSummary(line.ingredient, locale) }}
						</p>
					</div>
					<div class="flex shrink-0 flex-col items-end gap-1">
						<span class="text-body-sm font-bold text-content">
							{{ formatAmount(line.amount) }}
						</span>
						<Badge
							v-if="list.kind === 'ingredients'"
							:tone="'optional' in line && line.optional ? 'neutral' : 'accent'"
							:value="
								$t(
									`organisms.drinkView.${'optional' in line && line.optional ? 'optional' : 'required'}`
								)
							" />
					</div>
				</li>
			</ol>
			<Text v-else class="text-body-sm text-content-muted">
				{{ $t(`organisms.drinkView.empty.${list.kind}`) }}
			</Text>
		</FormSection>
		<FormSection
			:title="$t('organisms.drinkForm.methodSection.title')"
			:description="$t('organisms.drinkForm.methodSection.description')">
			<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
				<ReadOnlyField
					v-for="lang in languages"
					:key="lang"
					:label="`${$t('organisms.drinkForm.methodInput.label')} · ${$t(`languages.${lang}`)}`">
					<p class="whitespace-pre-line font-normal">
						{{ drink.translations[lang].method || '—' }}
					</p>
				</ReadOnlyField>
			</dl>
		</FormSection>
		<!-- Laid out like the drop zones of the form: the square thumbnail, then the wide cover beside it. -->
		<FormSection
			:title="$t('organisms.drinkForm.imagesSection.title')"
			:description="$t('organisms.drinkView.imagesDescription')">
			<div class="flex flex-col gap-6 tablet:flex-row">
				<figure class="flex flex-col gap-2 tablet:w-50 tablet:shrink-0">
					<figcaption class="text-caption text-content-muted">
						{{ $t('organisms.drinkForm.thumbnailInput.label') }}
					</figcaption>
					<div class="w-50 max-w-full self-center tablet:self-auto">
						<img
							v-if="drink.thumbnail?.url"
							:src="drink.thumbnail.url"
							:alt="
								$t('organisms.drinkView.thumbnailAlt', {
									name: drink.translations[locale].name
								})
							"
							class="aspect-square w-full rounded-md border border-stroke bg-surface-control object-cover"
							data-testid="thumbnail" />
						<div v-else :class="emptyImageClass" class="aspect-square">
							{{ $t('organisms.drinkView.noImage') }}
						</div>
					</div>
				</figure>
				<figure class="flex min-w-0 flex-1 flex-col gap-2">
					<figcaption class="text-caption text-content-muted">
						{{ $t('organisms.drinkForm.coverInput.label') }}
					</figcaption>
					<img
						v-if="drink.cover?.url"
						:src="drink.cover.url"
						:alt="
							$t('organisms.drinkView.coverAlt', {
								name: drink.translations[locale].name
							})
						"
						class="aspect-video w-full rounded-md border border-stroke bg-surface-control object-cover tablet:aspect-auto tablet:h-50"
						data-testid="cover" />
					<div
						v-else
						:class="emptyImageClass"
						class="aspect-video tablet:aspect-auto tablet:h-50">
						{{ $t('organisms.drinkView.noImage') }}
					</div>
				</figure>
			</div>
		</FormSection>
	</ReadOnlyView>
</template>
<script setup lang="ts">
import { DrinkIngredientAmountTypes } from '~/domain/drink/drink.constants';
import type { DrinkIngredientAmount } from '~/domain/drink/drink.entity';
import { languages } from '~/domain/shared/translations.constants';
import { formatDrinkAmount } from '~/helpers/drink.helpers';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const emptyImageClass =
	'w-full flex items-center justify-center rounded-md border border-dashed border-stroke text-body-sm text-content-muted';

// Whoever may change the drink has the edit form for it, so this view is only for the others.
const {
	record: drink,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `drink-view-${props.drinkId}`,
	subject: 'Drink',
	fetch: () => $api.drinks.getWithAuthorship(props.drinkId)
});

const recipeLists = computed(() =>
	drink.value
		? [
				{ kind: 'ingredients' as const, lines: drink.value.ingredients },
				{ kind: 'garnishes' as const, lines: drink.value.garnishes ?? [] }
			]
		: []
);

// The amount as the form describes it: the measure, the qualifier (with its hint), or no amount at all.
const formatAmount = (amount: DrinkIngredientAmount) => {
	if (amount.type === DrinkIngredientAmountTypes.none) {
		return t('organisms.recipeLines.amountType.options.none');
	}
	const measure = formatDrinkAmount(amount, locale.value);
	if (amount.type === DrinkIngredientAmountTypes.exact) return measure;
	const qualifier = t(`organisms.recipeLines.qualifier.options.${amount.qualifier}`);
	return measure ? `${qualifier} (≈ ${measure})` : qualifier;
};

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch drink:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed) $router.replace(localePath(`/drinks/${props.drinkId}/edit`));
	},
	{ immediate: true }
);
</script>
