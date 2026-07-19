<template>
	<NuxtLayout name="primary">
		<DrinkDetail :drink="drink" />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/types/drink.types';

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
