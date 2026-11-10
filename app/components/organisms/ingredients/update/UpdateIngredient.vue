<template>
	<IngredientForm
		v-if="ingredient && canUpdate"
		:ingredient="ingredient"
		:title="$t('organisms.ingredientForm.editTitle')"
		:submit-label="$t('organisms.ingredientForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateIngredient } from '~/mappers/ingredient.mappers';
import type { IngredientForm } from '~/types/ingredient.types';

const props = defineProps({
	ingredientId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();

// Read with authorship: only who may change the record gets the form, anyone else is sent to the read-only view.
const {
	record: ingredient,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `ingredient-edit-${props.ingredientId}`,
	subject: 'Ingredient',
	fetch: () => $api.ingredients.getWithAuthorship(props.ingredientId)
});

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch ingredient:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed === false) $router.replace(localePath(`/ingredients/${props.ingredientId}`));
	},
	{ immediate: true }
);

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
