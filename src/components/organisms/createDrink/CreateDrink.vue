<template>
	<div class="p-6">
		<DrinkForm @cancel="handleCancel" @submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import type { DrinkForm } from '~/types/drink';
import { mapFormToCreateDrink } from '~/helpers/drinkMappers';

const { $api, $router } = useNuxtApp();
const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const handleCancel = () => {
	resetFormState();
	$router.back();
};
const handleSubmit = async (drinkForm: DrinkForm) => {
	const createDrink = mapFormToCreateDrink(drinkForm);
	try {
		await $api.drinks.create(createDrink);
		addToast({ type: 'success', title: 'Success', message: 'drink has been created' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'drink has not been created' });
	}
};
</script>
