<template>
	<DrinkForm @cancel="handleCancel" @submit="handleSubmit" />
</template>
<script setup lang="ts">
import type { DrinkForm, DrinkFormAndMedia } from '~/types/drink.types';
import { mapFormToCreateDrink } from '~/mappers/drink.mappers';

const { $api, $router } = useNuxtApp();
const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const handleCancel = () => {
	resetFormState();
	$router.back();
};

const handleSubmit = async ({ form, cover, thumbnail }: DrinkFormAndMedia) => {
	const createDrink = mapFormToCreateDrink(form);
	let drinkId = '';
	try {
		const { id } = await $api.drinks.create(createDrink);
		drinkId = id;
		addToast({ type: 'success', title: 'Success', message: 'drink has been created' });
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'drink has not been created' });
		console.error(error);
		return;
	}

	if (cover && drinkId) {
		try {
			await $api.drinks.updateCover(drinkId, cover);
		} catch (error) {
			addToast({
				type: 'error',
				title: 'Error',
				message: 'drink cover has not been updated'
			});
			console.error(error);
		}
	}

	if (thumbnail && drinkId) {
		try {
			await $api.drinks.updateCover(drinkId, thumbnail);
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
