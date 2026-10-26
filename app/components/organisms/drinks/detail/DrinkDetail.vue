<template>
	<Box direction="col">
		<ImageCover
			v-if="drink.cover"
			:src="drink.cover.url"
			:alt="drink.translations[$i18n.locale].name" />
		<Box direction="col" class="gap-6 p-4" container>
			<Heading as="h1" size="headlineSm" class="text-center">
				{{ drink.translations[$i18n.locale].name }}
			</Heading>

			<div
				class="grid grid-cols-1 gap-6 @detail-layout:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
				<Box direction="col" class="gap-4">
					<Heading size="titleSm" class="text-center">
						{{ $t('drinkDetailPage.ingredients.title') }}
					</Heading>
					<TextList
						:items="ingredientItems"
						class="text-body-lg text-content-secondary"
						gap="none" />
				</Box>

				<Box direction="col" class="gap-4">
					<Heading size="titleSm" class="text-center">
						{{ $t('drinkDetailPage.instructions') }}
					</Heading>
					<Text class="text-body-lg text-content-secondary">
						{{ drink.translations[$i18n.locale].method }}
					</Text>
				</Box>

				<slot name="rating"></slot>
				<slot name="comments"></slot>
			</div>
		</Box>
	</Box>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink, DrinkIngredient } from '~/domain/drink/drink.entity';

const { t, locale } = useI18n();

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const formatIngredient = (ingredient: DrinkIngredient): string => {
	const lang = locale.value;
	const unit = ingredient.ingredient.unit;
	const symbol = unit.symbol?.trim();

	const measurement = symbol
		? `${ingredient.quantity}${unit.space_before_symbol ? ' ' : ''}${symbol}`
		: `${ingredient.quantity} ${
				ingredient.quantity === 1
					? unit.translations[lang].name
					: unit.translations[lang].name_plural
			}`;

	return `${measurement} ${t('drinkDetailPage.ingredients.ofPreposition')} ${ingredient.ingredient.translations[lang].name}`;
};

const ingredientItems = computed(() => props.drink.ingredients.map(formatIngredient));
</script>
