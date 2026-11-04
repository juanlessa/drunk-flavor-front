<template>
	<article class="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-3 pb-6 tablet:px-6">
		<!-- The back link sits closer to the header than the cards sit to each other. -->
		<div class="flex flex-col gap-3">
			<Anchor
				:to="localePath('/')"
				class="self-start inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('drinkDetailPage.backLink') }}
			</Anchor>

			<!-- With a cover the title sits on the photo; without one it is a plain header. -->
			<header
				v-if="props.drink.cover"
				class="relative overflow-hidden rounded-media bg-surface-sunken shadow-card">
				<img
					:src="props.drink.cover.url"
					alt=""
					class="block w-full h-64 tablet:h-72 object-cover" />
				<div class="absolute inset-0 bg-media-scrim" aria-hidden="true"></div>
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
					alt=""
					src-fallback="/thumbnail-placeholder.png"
					src-fallback-dark="/thumbnail-placeholder-dark.png" />
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
							<Text as="span" class="text-caption text-content-muted">
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
								<span class="min-w-0 text-content-secondary">
									<span class="font-bold text-content">
										{{ item.measurement }}
									</span>
									{{ item.connector }} {{ item.name }}
								</span>
							</li>
						</ul>
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
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const localePath = useLocalePath();
const ingredientsId = useId();
const methodId = useId();

const {
	name,
	method,
	ingredientItems,
	ingredientCountLabel,
	hasRatings,
	ratingSummaryText,
	ratingSummaryLabel
} = useDrinkSummary(() => props.drink);
</script>
