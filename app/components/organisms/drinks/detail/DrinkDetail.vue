<template>
	<Box direction="col">
		<div
			v-if="drink.cover"
			class="w-full h-[30vh] bg-center bg-no-repeat bg-cover rounded-md overflow-hidden"
			:style="{ backgroundImage: `url(${drink.cover})` }" />

		<Box direction="col" class="gap-6 p-4" container>
			<Heading type="h1" size="lg" class="text-center">
				{{ drink.translations[$i18n.locale].name }}
			</Heading>

			<Box direction="container-responsive" container-breakpoint="lg" class="gap-6">
				<Box direction="col" class="flex-1 gap-4">
					<Heading size="md" class="text-center">
						{{ $t('drinkDetailPage.ingredients') }}
					</Heading>
					<TextList :items="ingredientItems" size="lg" gap="none" />
				</Box>

				<Box direction="col" class="flex-2 gap-4">
					<Heading size="md" class="text-center">
						{{ $t('drinkDetailPage.instructions') }}
					</Heading>
					<Text size="lg">
						{{ drink.translations[$i18n.locale].method }}
					</Text>
				</Box>
			</Box>
		</Box>
	</Box>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/constants/drink';
import type { Drink, DrinkIngredient } from '~/types/drink';

const { t, locale } = useI18n();

const props = defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});

const formatIngredient = (ing: DrinkIngredient): string => {
	const lang = locale.value;
	const unit =
		ing.quantity === 1
			? ing.ingredient.translations[lang].unit
			: ing.ingredient.translations[lang].unit_plural;

	return `${ing.quantity} ${unit} ${t('drinkDetailPage.ingredients.ofPreposition')} ${ing.ingredient.translations[lang].name}`;
};

const ingredientItems = computed(() => props.drink.ingredients.map(formatIngredient));
</script>
