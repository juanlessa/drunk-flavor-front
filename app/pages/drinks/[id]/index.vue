<template>
	<NuxtLayout>
		<div
			v-if="!drink"
			class="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center"
			role="alert">
			<Heading as="h1" size="titleSm">{{ $t('drinkDetailPage.loadError.title') }}</Heading>
			<Text class="text-content-muted">{{ $t('drinkDetailPage.loadError.message') }}</Text>
			<Anchor :to="localePath('/')" class="text-body-sm">
				{{ $t('drinkDetailPage.backLink') }}
			</Anchor>
		</div>
		<DrinkDetail v-else :drink="drink" :missing-ingredient-ids="missingIngredientIds">
			<template #rating>
				<DrinkRatingSection :drink-id="drink.id" @summary-change="handleSummaryChange" />
			</template>
			<template #comments>
				<DrinkCommentsSection :drink-id="drink.id" />
			</template>
		</DrinkDetail>
	</NuxtLayout>
</template>
<script setup lang="ts">
import type { RatingSummary } from '~/domain/rating/rating.entity';
import { SITE_NAME } from '~/constants/site.constants';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import { getLocaleAgnosticPageKey, shouldScrollToTop } from '~/helpers/route.helpers';
import { formatIngredientList, getDrinkShareImage } from '~/helpers/seo.helpers';
import {
	buildBreadcrumbJsonLd,
	buildRecipeJsonLd,
	serializeJsonLd
} from '~/helpers/structuredData.helpers';

definePageMeta({
	middleware: 'guest',
	// Switching the language keeps the page mounted, so it still knows the drink was opened from the bar.
	key: (route) => getLocaleAgnosticPageKey(route),
	scrollToTop: shouldScrollToTop
});

const SERVICE_UNAVAILABLE_STATUS = 503;

const { $api } = useNuxtApp();
const route = useRoute('drinks-id');
const localePath = useLocalePath();

const drinkId = computed(() => route.params.id as string);

// Fetched on the server and carried in the payload, so the SSR HTML already holds the drink content.
// The key follows the route param, so navigating between drinks refetches.
const { data: drink, error } = await useAsyncData(
	() => `drink-${drinkId.value}`,
	(_nuxtApp, { signal }) => $api.drinks.get(drinkId.value, { signal })
);

if (error.value) {
	const status = error.value.status ?? error.value.statusCode;
	if (status === 404) {
		// Real 404 status on SSR, so search engines drop the URL instead of indexing a soft-404.
		throw createError({ status: 404, statusText: 'Not Found', fatal: true });
	}
	console.error(error.value);
	// Transient failures must not answer 200, or crawlers would index the error message.
	if (import.meta.server) setResponseStatus(useRequestEvent()!, SERVICE_UNAVAILABLE_STATUS);
}

const { t, locale } = useI18n();
// Only when the drink was opened from the bar; the plain recipe everywhere else.
const missingIngredientIds = useBarMissingIngredients(drink);

const drinkName = computed(() => drink.value?.translations[locale.value]?.name ?? '');
const seoDescription = computed(() => {
	if (!drink.value) return '';
	const ingredients = formatIngredientList(
		drink.value.ingredients.map(
			({ ingredient }) => ingredient.translations[locale.value]?.name ?? ''
		),
		locale.value
	);
	return ingredients
		? t('seo.drink.description', { name: drinkName.value, ingredients })
		: t('seo.drink.descriptionWithoutIngredients', { name: drinkName.value });
});

const siteUrl = useSiteConfig().url;

// The drink's own picture replaces the site-wide default image. The default's width and height
// describe another image, so they are cleared (`null` removes a tag); without a picture of its own
// the drink keeps the default image and its dimensions.
const shareImage = computed(() =>
	drink.value ? getDrinkShareImage(drink.value, drinkName.value, siteUrl) : undefined
);

useSeoMeta({
	title: () => drinkName.value,
	description: () => seoDescription.value,
	ogTitle: () => drinkName.value,
	ogDescription: () => seoDescription.value,
	ogType: 'article',
	ogImage: () => shareImage.value?.url,
	ogImageAlt: () => shareImage.value?.alt,
	ogImageWidth: () => (shareImage.value ? null : undefined),
	ogImageHeight: () => (shareImage.value ? null : undefined),
	twitterCard: () => shareImage.value?.card
});

// Structured data for search results (recipe card, star rating, breadcrumb). The ingredient lines are
// the same ones the page shows, because Google requires the markup to match the visible content.
const { method, ingredientItems } = useDrinkSummary(() => drink.value ?? initEmptyDrink());

const structuredData = computed(() => {
	if (!drink.value) return undefined;
	const pageUrl = new URL(route.path, siteUrl).href;
	const recipe = buildRecipeJsonLd({
		drink: drink.value,
		name: drinkName.value,
		description: seoDescription.value,
		method: method.value,
		ingredients: ingredientItems.value.map(
			({ measurement, connector, name }) => `${measurement} ${connector} ${name}`
		),
		category: t('seo.drink.recipeCategory'),
		locale: locale.value,
		url: pageUrl,
		siteUrl,
		publisherName: SITE_NAME
	});
	if (!recipe) return undefined;
	return [
		recipe,
		buildBreadcrumbJsonLd([
			{ name: SITE_NAME, url: new URL(localePath('/').toString(), siteUrl).href },
			{ name: drinkName.value, url: pageUrl }
		])
	];
});

useHead({
	script: computed(() =>
		structuredData.value
			? [
					{
						key: 'drink-structured-data',
						type: 'application/ld+json',
						innerHTML: serializeJsonLd(structuredData.value)
					}
				]
			: []
	)
});

// Keeps the header summary in step with ratings saved or removed on this page.
const handleSummaryChange = ({ average, count }: RatingSummary) => {
	if (!drink.value) return;
	drink.value = { ...drink.value, avgRating: average, ratingsCount: count };
};
</script>
