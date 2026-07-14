<template>
	<div class="flex flex-col w-full max-w-screen-desktop mx-auto">
		<div
			v-if="drink.cover"
			class="w-full h-[30vh] bg-center bg-no-repeat bg-cover rounded-md overflow-hidden"
			:style="{ backgroundImage: `url(${drink.cover})` }" />

		<div class="flex flex-col gap-6 p-4 bg-white dark:bg-black">
			<Heading type="h1" size="lg" class="text-center">
				{{ drink.translations[$i18n.locale as Language].name }}
			</Heading>

			<div class="flex flex-col desktop:flex-row gap-6">
				<div class="desktop:flex-1">
					<Heading size="md" class="text-center mb-4">
						{{ $t('drinkDetailPage.ingredients') }}
					</Heading>
					<ul class="flex flex-col gap-2">
						<li v-for="ing in drink.ingredients" :key="ing.ingredient._id">
							<Text size="lg">
								{{ ing.quantity }}
								{{ ing.quantity === 1
									? ing.ingredient.translations[$i18n.locale as Language].unit
									: ing.ingredient.translations[$i18n.locale as Language].unit_plural
								}}
								{{ $t('drinkDetailPage.ingredients.ofPreposition') }}
								{{ ing.ingredient.translations[$i18n.locale as Language].name }}
							</Text>
						</li>
					</ul>
				</div>

				<div class="desktop:flex-[2]">
					<Heading size="md" class="text-center mb-4">
						{{ $t('drinkDetailPage.instructions') }}
					</Heading>
					<Text size="lg">
						{{ drink.translations[$i18n.locale as Language].method }}
					</Text>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/constants/drink';
import type { Drink } from '~/types/drink';
import type { Language } from '~/types/translations';

defineProps({
	drink: {
		type: Object as PropType<Drink>,
		default: () => initEmptyDrink()
	}
});
</script>
