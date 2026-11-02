<template>
	<NuxtLayout>
		<DrinkDetailSkeleton v-if="isLoading" />
		<div
			v-else-if="hasLoadError"
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
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';
import type { RatingSummary } from '~/domain/rating/rating.entity';

definePageMeta({
	middleware: 'guest'
});

const { $api } = useNuxtApp();
const route = useRoute('drinks-id');
const localePath = useLocalePath();

const drink = ref<Drink>(initEmptyDrink());
const isLoading = ref(true);
const hasLoadError = ref(false);

// Keeps the header summary in step with ratings saved or removed on this page.
const handleSummaryChange = ({ average, count }: RatingSummary) => {
	drink.value = { ...drink.value, avgRating: average, ratingsCount: count };
};

onMounted(async () => {
	try {
		drink.value = await $api.drinks.get(route.params.id as string);
	} catch (error) {
		console.error(error);
		hasLoadError.value = true;
	} finally {
		isLoading.value = false;
	}
});
</script>
