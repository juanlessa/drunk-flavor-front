<template>
	<IngredientForm :ingredient="ingredient" @cancel="handleCancel" @submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateIngredient } from '~/mappers/ingredient.mappers';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { IngredientForm } from '~/types/ingredient.types';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const ingredient = ref<Ingredient | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.ingredients.get(props.ingredientId));

if (error.value) {
	console.error('Failed to fetch category:', error.value);
}
if (data.value) {
	ingredient.value = data.value;
}

const handleCancel = () => {
	resetFormState();
	$router.back();
};
const handleSubmit = async (ingredientForm: IngredientForm) => {
	const updateIngredient = mapFormToUpdateIngredient(props.ingredientId, ingredientForm);
	try {
		await $api.ingredients.update(updateIngredient);
		addToast({ type: 'success', title: 'Success', message: 'ingredient has been updated' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'ingredient has been updated' });
		console.error(error);
	}
};
</script>
