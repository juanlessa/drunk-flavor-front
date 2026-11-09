<template>
	<HoverCard side="right" :side-offset="-8" :align="'start'" :align-offset="8">
		<template #trigger>
			<Card
				class="w-full h-full tablet:max-w-drink-card-tablet desktop:max-w-drink-card-desktop p-2 flex gap-4 cursor-pointer hover:bg-surface-hover transition-colors duration-short has-focus-visible:outline-2 has-focus-visible:outline-focus-ring has-focus-visible:-outline-offset-2">
				<ImageThumbnail
					class="h-full aspect-square shrink-0 rounded-control"
					:src="drink.thumbnail?.url ?? ''"
					alt="drink thumbnail"
					src-fallback="/thumbnail-placeholder.png"
					src-fallback-dark="/thumbnail-placeholder-dark.png" />
				<div class="flex-1 min-w-0 flex flex-col overflow-hidden">
					<Heading ref="nameRef" class="text-center line-clamp-2 shrink-0">
						<!-- Stretched link: a real anchor (crawlable, opens in a new tab) that covers the whole card. -->
						<NuxtLink
							:to="localePath(`/drinks/${drink.id}`)"
							class="after:absolute after:inset-0 after:rounded-card focus-visible:outline-hidden">
							{{ drink.translations[$i18n.locale].name }}
						</NuxtLink>
					</Heading>
					<div v-if="!isNameWrapped" class="mt-2 min-w-0">
						<Text
							as="span"
							class="block text-caption-sm font-bold uppercase tracking-wide text-content-muted">
							{{ $t('organisms.drinkCard.ingredientsLabel') }}
						</Text>
						<Text
							class="mt-1 text-body-sm text-content-secondary leading-short line-clamp-2">
							<template
								v-for="(item, index) in ingredientPreviewItems"
								:key="item.id">
								<template v-if="index > 0"> · </template>
								<span
									v-if="item.missing"
									class="font-bold text-warning underline decoration-dotted underline-offset-2">
									{{ item.name }}
								</span>
								<template v-else>{{ item.name }}</template>
							</template>
						</Text>
					</div>
					<div class="mt-auto pt-1 min-w-0 flex items-center justify-between gap-2">
						<!-- Matched by ingredients: what is missing replaces the ingredient count. -->
						<Badge
							v-if="matchStatus"
							:tone="matchStatus.tone"
							class="min-w-0 max-w-full truncate"
							:title="matchStatus.label">
							<span
								v-if="matchStatus.tone === 'success'"
								aria-hidden="true"
								class="mr-1"
								>✓</span
							>
							<span class="truncate">{{ matchStatus.label }}</span>
						</Badge>
						<Text
							v-else
							as="span"
							class="min-w-0 text-caption text-content-muted truncate">
							{{ ingredientCountLabel }}
						</Text>
						<div
							class="shrink-0 inline-flex items-center gap-1"
							role="img"
							:aria-label="ratingAriaLabel">
							<StarIcon
								class="size-4"
								:class="hasRatings ? 'text-rating' : 'text-rating-empty'" />
							<Text
								as="span"
								class="text-caption font-bold"
								:class="
									hasRatings ? 'text-content-secondary' : 'text-content-muted'
								">
								{{ hasRatings ? formattedAverage : '—' }}
							</Text>
							<Text
								v-if="hasRatings"
								as="span"
								class="text-caption text-content-muted">
								({{ formattedRatingsCount }})
							</Text>
						</div>
					</div>
				</div>
			</Card>
		</template>

		<DrinkPreview :drink="drink" />
	</HoverCard>
</template>
<script setup lang="ts">
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import { getMissingIngredientNames } from '~/helpers/drinkMatch.helpers';

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	},
	/**
	 * The required ingredients of the drink the person does not have, when the drink was matched by ingredients.
	 * Left out everywhere else; with it, the card says whether the drink can be made and what is missing.
	 */
	missingIngredientIds: {
		type: Array as PropType<readonly string[]>,
		default: undefined
	}
});

const { locale, t } = useI18n();
const localePath = useLocalePath();

const nameRef = ref<{ $el?: HTMLElement } | HTMLElement | null>(null);
const isNameWrapped = ref(false);
let resizeObserver: ResizeObserver | undefined;

const getNameElement = (): HTMLElement | null => {
	const target = nameRef.value;
	if (!target) return null;
	return target instanceof HTMLElement ? target : (target.$el ?? null);
};

const measureName = () => {
	const element = getNameElement();
	if (!element) return;
	const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
	if (!Number.isFinite(lineHeight)) return;
	// scrollHeight includes clipped lines, so it detects wrapping even with line-clamp.
	isNameWrapped.value = element.scrollHeight > lineHeight * 1.5;
};

onMounted(() => {
	const element = getNameElement();
	if (!element) return;
	measureName();
	resizeObserver = new ResizeObserver(measureName);
	resizeObserver.observe(element);
});
onBeforeUnmount(() => resizeObserver?.disconnect());
watch(
	() => props.drink.translations[locale.value]?.name,
	() => nextTick(measureName)
);

const MAX_PREVIEW_INGREDIENTS = 3;

// Optional ingredients are left out of the card: it summarizes what the drink needs.
const requiredIngredients = computed(() =>
	props.drink.ingredients.filter((item) => !item.optional).map((item) => item.ingredient)
);
const ingredientNames = computed(() =>
	requiredIngredients.value.map((ingredient) => ingredient.translations[locale.value].name)
);
const missingIds = computed(() => new Set(props.missingIngredientIds ?? []));
const ingredientPreviewItems = computed(() =>
	requiredIngredients.value.slice(0, MAX_PREVIEW_INGREDIENTS).map((ingredient, index) => ({
		id: `${ingredient.id}-${index}`,
		name: ingredient.translations[locale.value].name,
		missing: missingIds.value.has(ingredient.id)
	}))
);
const matchStatus = computed<{ tone: 'success' | 'warning'; label: string } | undefined>(() => {
	if (!props.missingIngredientIds) return undefined;
	const names = getMissingIngredientNames(props.drink, props.missingIngredientIds, locale.value);
	if (names.length === 0) return { tone: 'success', label: t('organisms.drinkCard.matchReady') };
	return {
		tone: 'warning',
		label: t(
			'organisms.drinkCard.matchMissing',
			{ names: names.join(', '), count: names.length },
			names.length
		)
	};
});
const ingredientCountLabel = computed(() => {
	// When the preview is hidden (wrapped name), show the total instead of the remaining count.
	const hiddenCount = isNameWrapped.value
		? 0
		: Math.max(ingredientNames.value.length - MAX_PREVIEW_INGREDIENTS, 0);
	return hiddenCount
		? t('organisms.drinkCard.remainingIngredients', hiddenCount)
		: t('organisms.drinkCard.ingredientsCount', ingredientNames.value.length);
});

const numberLocale = computed(() => (locale.value === 'pt' ? 'pt-BR' : 'en-US'));
const hasRatings = computed(() => props.drink.ratingsCount > 0);
const formattedAverage = computed(() =>
	new Intl.NumberFormat(numberLocale.value, {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(props.drink.avgRating)
);
const formattedRatingsCount = computed(() =>
	new Intl.NumberFormat(numberLocale.value).format(props.drink.ratingsCount)
);
const ratingAriaLabel = computed(() => {
	if (!hasRatings.value) return t('organisms.drinkCard.noRatings');

	return t(
		props.drink.ratingsCount === 1
			? 'organisms.drinkCard.ratingSummaryLabelOne'
			: 'organisms.drinkCard.ratingSummaryLabelMany',
		{ value: formattedAverage.value, count: formattedRatingsCount.value }
	);
});
</script>
