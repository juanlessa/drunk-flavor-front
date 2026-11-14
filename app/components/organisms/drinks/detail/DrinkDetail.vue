<template>
	<article class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-3 pb-6 tablet:px-6">
		<!-- The back link sits closer to the header than the cards sit to each other. -->
		<div class="flex flex-col gap-3">
			<!--
				Back to wherever the drink was opened from (the home, the bar). A plain anchor, not the Anchor
				atom: RouterLink would navigate to the href before the click handler could go back instead.
				The href is the fallback for a new tab or a page opened directly.
			-->
			<a
				:href="homePath"
				class="self-start inline-flex items-center gap-1 text-body-sm font-regular text-content cursor-pointer"
				@click="goBack">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('drinkDetailPage.back') }}
			</a>

			<!-- With a cover the title sits on the photo; without one it is a plain header. -->
			<header
				v-if="props.drink.cover"
				class="relative overflow-hidden rounded-media bg-surface-sunken shadow-card">
				<img
					:src="props.drink.cover.url"
					alt=""
					class="block w-full h-64 tablet:h-72 object-cover" />
				<div class="absolute inset-0 bg-media-scrim" aria-hidden="true"></div>
				<FavoriteButton
					:drink-id="props.drink.id"
					:drink-name="name"
					variant="media"
					class="top-4 right-4 tablet:top-5 tablet:right-5" />
				<div
					class="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 tablet:p-8 text-white">
					<!-- Plain h1: the Heading atom's content color would fight the white text on the photo. -->
					<h1 class="text-headline-sm tablet:text-headline font-bold wrap-break-word">
						{{ name }}
					</h1>
					<a
						href="#ratings"
						class="self-start inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-body-sm backdrop-blur-sm focus-visible:outline-hidden focus-visible:shadow-focus-ring"
						:aria-label="ratingSummaryLabel">
						<StarIcon class="size-4 text-rating" aria-hidden="true" />
						<span aria-hidden="true">{{ ratingSummaryText }}</span>
					</a>
				</div>
			</header>
			<header v-else class="flex items-center gap-4">
				<ImageThumbnail
					v-if="props.drink.thumbnail"
					class="size-20 tablet:size-24 shrink-0 rounded-media"
					:src="props.drink.thumbnail.url"
					alt="">
					<template #fallback>
						<DrinkThumbnailFallback />
					</template>
				</ImageThumbnail>
				<div class="min-w-0 flex flex-col gap-2">
					<Heading as="h1" size="headlineSm" class="tablet:text-headline wrap-break-word">
						{{ name }}
					</Heading>
					<a
						href="#ratings"
						class="self-start inline-flex items-center gap-1.5 rounded-full text-body-sm text-content-secondary hover:text-content focus-visible:outline-hidden focus-visible:shadow-focus-ring"
						:aria-label="ratingSummaryLabel">
						<StarIcon
							class="size-4"
							:class="hasRatings ? 'text-rating' : 'text-rating-empty'"
							aria-hidden="true" />
						<span aria-hidden="true">{{ ratingSummaryText }}</span>
					</a>
				</div>
				<FavoriteButton
					:drink-id="props.drink.id"
					:drink-name="name"
					variant="pill"
					class="ml-auto shrink-0 self-start" />
			</header>
		</div>

		<!--
			Mobile: one column (ingredients, method, ratings, comments).
			Tablet and up: two independent columns, so ratings sit right under the ingredients and
			comments right under the method. The column wrappers use `display: contents` below
			tablet, which lets `order` interleave their cards into the single grid.
		-->
		<div
			class="grid grid-cols-1 items-start gap-6 tablet:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
			<div class="contents tablet:flex tablet:flex-col tablet:gap-6 tablet:min-w-0">
				<Card class="order-1">
					<section
						class="flex flex-col gap-4 p-5 tablet:p-6"
						:aria-labelledby="ingredientsId">
						<div class="flex items-baseline justify-between gap-2">
							<Heading :id="ingredientsId" as="h2" size="titleSm">
								{{ $t('drinkDetailPage.ingredients.title') }}
							</Heading>
							<!-- Opened from the bar: whether it can be made replaces the ingredient count. -->
							<Badge
								v-if="matchStatus"
								:tone="matchStatus.tone"
								class="shrink-0 self-center"
								data-testid="drink-match-status">
								<span
									v-if="matchStatus.tone === 'success'"
									aria-hidden="true"
									class="mr-1"
									>✓</span
								>
								{{ matchStatus.label }}
							</Badge>
							<Text v-else as="span" class="text-caption text-content-muted">
								{{ ingredientCountLabel }}
							</Text>
						</div>
						<ul class="flex flex-col divide-y divide-stroke">
							<li
								v-for="item in ingredientItems"
								:key="item.id"
								class="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0 text-body">
								<span
									class="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-accent"
									aria-hidden="true"></span>
								<div class="flex min-w-0 flex-1 flex-col">
									<div class="flex items-baseline justify-between gap-3">
										<span class="min-w-0 text-content-secondary">
											<span class="font-bold text-content">
												{{ item.measurement }}
											</span>
											{{ item.connector }} {{ item.name }}
										</span>
										<Badge
											v-if="item.missing"
											tone="warning"
											class="shrink-0 self-center"
											:value="$t('drinkDetailPage.ingredients.missing')" />
										<Badge
											v-else-if="item.optional"
											class="shrink-0 self-center"
											:value="$t('drinkDetailPage.ingredients.optional')" />
									</div>
									<span
										v-if="item.description"
										class="text-body-sm text-content-muted">
										{{ item.description }}
									</span>
									<span v-if="item.brand" class="text-body-sm text-content-muted">
										<span class="font-medium">
											{{ $t('drinkDetailPage.ingredients.brand') }}:
										</span>
										{{ item.brand }}
									</span>
								</div>
							</li>
						</ul>
						<div
							v-if="garnishItems.length"
							class="flex flex-col gap-3 border-t border-stroke pt-4">
							<h3 :id="garnishesId" class="text-body font-bold text-content">
								{{ $t('drinkDetailPage.garnishes.title') }}
							</h3>
							<ul
								class="flex flex-col divide-y divide-stroke"
								:aria-labelledby="garnishesId">
								<li
									v-for="item in garnishItems"
									:key="item.id"
									class="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0 text-body">
									<span
										class="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-accent"
										aria-hidden="true"></span>
									<span class="min-w-0 text-content-secondary">
										<span
											v-if="item.measurement"
											class="font-bold text-content">
											{{ item.measurement }}
										</span>
										{{ item.connector }} {{ item.name }}
										<span
											v-if="item.description"
											class="block text-body-sm text-content-muted">
											{{ item.description }}
										</span>
										<span
											v-if="item.brand"
											class="block text-body-sm text-content-muted">
											<span class="font-medium">
												{{ $t('drinkDetailPage.ingredients.brand') }}:
											</span>
											{{ item.brand }}
										</span>
									</span>
								</li>
							</ul>
						</div>
					</section>
				</Card>
				<div class="order-3">
					<slot name="rating"></slot>
				</div>
			</div>
			<div class="contents tablet:flex tablet:flex-col tablet:gap-6 tablet:min-w-0">
				<Card class="order-2">
					<section class="flex flex-col gap-4 p-5 tablet:p-6" :aria-labelledby="methodId">
						<Heading :id="methodId" as="h2" size="titleSm">
							{{ $t('drinkDetailPage.instructions') }}
						</Heading>
						<Text
							class="text-body-lg text-content-secondary whitespace-pre-line wrap-break-word">
							{{ method }}
						</Text>
					</section>
				</Card>
				<div class="order-4">
					<slot name="comments"></slot>
				</div>
			</div>
		</div>
	</article>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import StarIcon from '~/components/icons/StarIcon.vue';
import DrinkThumbnailFallback from '../thumbnailFallback/DrinkThumbnailFallback.vue';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	},
	/**
	 * The required ingredients missing from the person's bar, when the drink was opened from it. Left out
	 * everywhere else; with it, the page says whether the drink can be made and marks what is missing.
	 */
	missingIngredientIds: {
		type: Array as PropType<readonly string[]>,
		default: undefined
	}
});

const localePath = useLocalePath();
const homePath = computed(() => localePath('/').toString());
const goBack = useGoBack(homePath);
const ingredientsId = useId();
const methodId = useId();
const garnishesId = useId();

const {
	name,
	method,
	ingredientItems,
	garnishItems,
	ingredientCountLabel,
	matchStatus,
	hasRatings,
	ratingSummaryText,
	ratingSummaryLabel
} = useDrinkSummary(
	() => props.drink,
	() => props.missingIngredientIds
);
</script>
