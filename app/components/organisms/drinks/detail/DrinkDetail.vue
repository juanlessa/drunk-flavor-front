<template>
	<Box direction="col">
		<ImageCover
			v-if="drink.cover"
			:src="drink.cover.url"
			:alt="drink.translations[$i18n.locale].name" />
		<Box direction="col" class="gap-6 p-4" container>
			<Heading as="h1" class="text-center text-headline-sm">
				{{ drink.translations[$i18n.locale].name }}
			</Heading>

			<Box direction="col" class="gap-6 @detail-layout:flex-row">
				<Box direction="col" class="flex-1 gap-4">
					<Heading class="text-center">
						{{ $t('drinkDetailPage.ingredients.title') }}
					</Heading>
					<TextList
						:items="ingredientItems"
						class="text-body-lg text-content-secondary"
						gap="none" />
				</Box>

				<Box direction="col" class="flex-2 gap-4">
					<Heading class="text-center">
						{{ $t('drinkDetailPage.instructions') }}
					</Heading>
					<Text class="text-body-lg text-content-secondary">
						{{ drink.translations[$i18n.locale].method }}
					</Text>
				</Box>
			</Box>
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

const formatIngredient = (ing: DrinkIngredient): string => {
	const lang = locale.value;
	const unitTranslation = ing.ingredient.unit.translations[lang];
	const unit = ing.quantity === 1 ? unitTranslation.name : unitTranslation.name_plural;

	return `${ing.quantity} ${unit} ${t('drinkDetailPage.ingredients.ofPreposition')} ${ing.ingredient.translations[lang].name}`;
};

const ingredientItems = computed(() => props.drink.ingredients.map(formatIngredient));
</script>
