<template>
	<IngredientForm
		:title="$t('organisms.ingredientForm.createTitle')"
		:submit-label="$t('organisms.ingredientForm.createButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import type { IngredientForm } from '~/types/ingredient.types';
import { mapFormToCreateIngredient } from '~/mappers/ingredient.mappers';

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
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
		resetFormState();
		addToast({
			type: 'success',
			title: t('organisms.ingredientForm.createSuccess.title'),
			message: t('organisms.ingredientForm.createSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.ingredientForm.createError.title'),
			message: t('organisms.ingredientForm.createError.message')
		});
		console.error(error);
	}
};
</script>
