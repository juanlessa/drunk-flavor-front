<template>
	<div class="p-6">
		<IngredientForm @cancel="handleCancel" @submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import type { IngredientForm } from '~/types/ingredient';
import { mapFormToCreateIngredient } from '~/helpers/ingredientMappers';

const { $api, $router } = useNuxtApp();
const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const handleCancel = () => {
	resetFormState();
	$router.back();
};
const handleSubmit = async (ingredientForm: IngredientForm) => {
	const createIngredient = mapFormToCreateIngredient(ingredientForm);
	try {
		await $api.ingredients.create(createIngredient);
		addToast({ type: 'success', title: 'Success', message: 'ingredient has been created' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'ingredient has not been created' });
		console.error(error);
	}
};
</script>
