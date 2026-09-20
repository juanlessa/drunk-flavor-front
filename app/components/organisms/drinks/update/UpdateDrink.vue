<template>
	<DrinkForm :drink="drink" @cancel="handleCancel" @submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateDrink } from '~/mappers/drink.mappers';
import type { Drink, DrinkFormAndMedia } from '~/types/drink.types';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { resetFormState } = useDrinkForm();
const { addToast } = useToast();

const drink = ref<Drink | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.drinks.get(props.drinkId));

if (error.value) {
	console.error('Failed to fetch drink:', error.value);
}
if (data.value) {
	drink.value = data.value;
}

const handleCancel = () => {
	resetFormState();
	$router.back();
};

const handleSubmit = async ({ form, cover, thumbnail }: DrinkFormAndMedia) => {
	const updateDrink = mapFormToUpdateDrink(props.drinkId, form);
	try {
		await $api.drinks.update(updateDrink);
		addToast({ type: 'success', title: 'Success', message: 'drink has been updated' });
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'drink has not been updated' });
		console.error(error);
		return;
	}

	if (cover) {
		try {
			await $api.drinks.updateCover(props.drinkId, cover);
		} catch (error) {
			addToast({
				type: 'error',
				title: 'Error',
				message: 'drink cover has not been updated'
			});
			console.error(error);
		}
	}

	if (thumbnail) {
		try {
			await $api.drinks.updateThumbnail(props.drinkId, thumbnail);
		} catch (error) {
			addToast({
				type: 'error',
				title: 'Error',
				message: 'drink thumbnail has not been updated'
			});
			console.error(error);
		}
	}

	$router.back();
};
</script>
