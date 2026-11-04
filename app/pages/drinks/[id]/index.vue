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
		<DrinkDetail v-else :drink="drink">
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
import { formatIngredientList } from '~/helpers/seo.helpers';

definePageMeta({
	middleware: 'guest'
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

useSeoMeta({
	title: () => drinkName.value,
	description: () => seoDescription.value,
	ogTitle: () => drinkName.value,
	ogDescription: () => seoDescription.value,
	ogType: 'article'
});

// Keeps the header summary in step with ratings saved or removed on this page.
const handleSummaryChange = ({ average, count }: RatingSummary) => {
	if (!drink.value) return;
	drink.value = { ...drink.value, avgRating: average, ratingsCount: count };
};
</script>
