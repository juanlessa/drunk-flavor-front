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
							{{ ingredientPreview }}
						</Text>
					</div>
					<div class="mt-auto pt-1 min-w-0 flex items-center justify-between gap-2">
						<Text as="span" class="min-w-0 text-caption text-content-muted truncate">
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

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
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
const ingredientNames = computed(() =>
	props.drink.ingredients
		.filter((item) => !item.optional)
		.map((item) => item.ingredient.translations[locale.value].name)
);
const ingredientPreview = computed(() =>
	ingredientNames.value.slice(0, MAX_PREVIEW_INGREDIENTS).join(' · ')
);
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
