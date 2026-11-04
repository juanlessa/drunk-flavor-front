<template>
	<IngredientForm
		:ingredient="ingredient"
		:title="$t('organisms.ingredientForm.editTitle')"
		:submit-label="$t('organisms.ingredientForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateIngredient } from '~/mappers/ingredient.mappers';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import type { IngredientForm } from '~/types/ingredient.types';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();

const ingredient = ref<Ingredient | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.ingredients.get(props.ingredientId));

if (error.value) {
	console.error('Failed to fetch ingredient:', error.value);
}

if (data.value) {
	ingredient.value = data.value;
}

const handleCancel = () => {
	$router.back();
};

const handleSubmit = async (ingredientForm: IngredientForm) => {
	const updateIngredient = mapFormToUpdateIngredient(props.ingredientId, ingredientForm);
	try {
		await $api.ingredients.update(updateIngredient);
		addToast({
			type: 'success',
			title: t('organisms.ingredientForm.updateSuccess.title'),
			message: t('organisms.ingredientForm.updateSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.ingredientForm.updateError.title'),
			message: t('organisms.ingredientForm.updateError.message')
		});
		console.error(error);
	}
};
</script>
