<template>
	<NuxtLayout name="primary">
		<DrinkDetail :drink="drink">
			<template #rating>
				<DrinkRatingSection v-if="drink._id" :drink-id="drink._id" />
			</template>
		</DrinkDetail>
	</NuxtLayout>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';

definePageMeta({
	middleware: 'guest'
});

const { $api } = useNuxtApp();
const route = useRoute('drinks-id');

const drink = ref<Drink>(initEmptyDrink());

onMounted(async () => {
	const drinkId = route.params.id as string;
	drink.value = await $api.drinks.get(drinkId);
});
</script>
