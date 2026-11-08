<template>
	<!--
		Compact, single-column summary shown in the drink card hover. It scrolls inside the
		space the popover has on screen, so a long method never pushes it off the viewport.
	-->
	<article
		class="w-96 max-w-[calc(100vw-2rem)] max-h-(--radix-hover-card-content-available-height) overflow-y-auto rounded-overlay flex flex-col"
		:aria-labelledby="titleId">
		<div v-if="props.drink.cover" class="relative shrink-0">
			<img :src="props.drink.cover.url" alt="" class="block w-full h-40 object-cover" />
			<div class="absolute inset-0 bg-media-scrim" aria-hidden="true"></div>
			<div class="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 text-white">
				<h3 :id="titleId" class="text-title font-bold wrap-break-word">{{ name }}</h3>
				<p
					class="self-start inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-0.5 text-caption backdrop-blur-sm"
					:aria-label="ratingSummaryLabel">
					<StarIcon class="size-3.5 text-rating" aria-hidden="true" />
					<span aria-hidden="true">{{ ratingSummaryText }}</span>
				</p>
			</div>
		</div>
		<header v-else class="flex flex-col gap-1 px-4 pt-4">
			<h3 :id="titleId" class="text-title font-bold text-content wrap-break-word">
				{{ name }}
			</h3>
			<p
				class="inline-flex items-center gap-1.5 text-caption text-content-secondary"
				:aria-label="ratingSummaryLabel">
				<StarIcon
					class="size-3.5"
					:class="hasRatings ? 'text-rating' : 'text-rating-empty'"
					aria-hidden="true" />
				<span aria-hidden="true">{{ ratingSummaryText }}</span>
			</p>
		</header>

		<div class="flex flex-col gap-4 p-4">
			<section class="flex flex-col gap-2" :aria-labelledby="ingredientsId">
				<div class="flex items-baseline justify-between gap-2">
					<h4
						:id="ingredientsId"
						class="text-caption font-bold uppercase tracking-wide text-content-muted">
						{{ $t('drinkDetailPage.ingredients.title') }}
					</h4>
					<span class="text-caption text-content-muted">{{ ingredientCountLabel }}</span>
				</div>
				<ul class="flex flex-col gap-1">
					<li
						v-for="item in ingredientItems"
						:key="item.id"
						class="flex items-baseline gap-2.5 text-body-sm">
						<span
							class="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent"
							aria-hidden="true"></span>
						<span class="min-w-0 text-content-secondary">
							<span class="font-bold text-content">{{ item.measurement }}</span>
							{{ item.connector }} {{ item.name }}
						</span>
					</li>
				</ul>
			</section>
			<section
				class="flex flex-col gap-2 border-t border-stroke pt-4"
				:aria-labelledby="methodId">
				<h4
					:id="methodId"
					class="text-caption font-bold uppercase tracking-wide text-content-muted">
					{{ $t('drinkDetailPage.instructions') }}
				</h4>
				<p class="text-body-sm text-content-secondary whitespace-pre-line wrap-break-word">
					{{ method }}
				</p>
			</section>
		</div>
	</article>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import StarIcon from '~/components/icons/StarIcon.vue';
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const { t } = useI18n();
const titleId = useId();
const ingredientsId = useId();
const methodId = useId();

const {
	name,
	method,
	ingredientItems: allIngredientItems,
	hasRatings,
	ratingSummaryText,
	ratingSummaryLabel
} = useDrinkSummary(() => props.drink);

// Like the card, the preview leaves optional ingredients out.
const ingredientItems = computed(() => allIngredientItems.value.filter((item) => !item.optional));
const ingredientCountLabel = computed(() =>
	t('drinkDetailPage.ingredients.count', ingredientItems.value.length)
);
</script>
