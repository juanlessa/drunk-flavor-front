<template>
	<div class="p-6">
		<IngredientForm
			:ingredient-form="ingredientForm"
			@cancel="handleCancel"
			@submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import { mapFormToUpdateIngredient, mapIngredientToForm } from '~/helpers/ingredientMappers';
import type { IngredientForm } from '~/types/ingredient';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();

const { resetFormState } = useIngredientForm();
const { addToast } = useToast();

const ingredientForm = ref<IngredientForm | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.ingredients.get(props.ingredientId));

if (error.value) {
	console.error('Failed to fetch category:', error.value);
}
if (data.value) {
	ingredientForm.value = mapIngredientToForm(data.value);
}

const handleCancel = () => {
	resetFormState();
	$router.back();
};
const handleSubmit = async (ingredientForm: IngredientForm) => {
	const updateIngredient = mapFormToUpdateIngredient(props.ingredientId, ingredientForm);
	try {
		await $api.categories.updateCategory(updateIngredient);
		addToast({ type: 'success', title: 'Success', message: 'ingredient has been updated' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'ingredient has been updated' });
	}
};
</script>
