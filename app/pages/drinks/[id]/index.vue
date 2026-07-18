<template>
	<NuxtLayout name="primary">
		<DrinkDetail :drink="drink" />
	</NuxtLayout>
</template>
<script setup lang="ts">
import { initEmptyDrink } from '~/constants/drink';
import type { Drink } from '~/types/drink';

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
