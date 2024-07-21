<template>
	<div class="p-6">
		<IngredientForm
			:ingredient-form="ingredient"
			@cancel="handleCancel"
			@submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import { mapFormToUpdateIngredient } from '~/helpers/ingredientMappers';
import type { IIngredient, IngredientForm } from '~/types/ingredient';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const ingredient = ref<IIngredient | undefined>(undefined);

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
	}
};
</script>
