<template>
	<ButtonGroup class="py-4">
		<Button @click="handleCreateIngredient">
			{{ $t('organisms.categoriesControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div class="flex justify-center gap-4 flex-wrap">
		<ItemControlCard
			v-for="ingredient in overviewState.ingredients"
			:key="ingredient._id"
			:content="ingredient.translations[$i18n.locale as Language].name"
			@click="() => handleEditIngredient(ingredient._id)"
			@action="() => handleDeleteIngredient(ingredient)" />

		<template v-if="overviewState.loading">
			<ItemControlCardSkeleton
				v-for="idx in Array.from({ length: 40 }, (_, i) => i)"
				:key="idx" />
		</template>
	</div>
	<DeleteModal
		v-model:open="isDeleteModalOpen"
		@cancel="handleCancelDeleteIngredient"
		@delete="handleConfirmDeleteIngredient">
		<template #title>
			{{
				`${$t('organisms.ingredientsControlOverview.deleteModal.title')} ${ingredientToDelete.translations[$i18n.locale as Language].name}`
			}}
		</template>
		<template #description>
			{{ `${$t('organisms.ingredientsControlOverview.deleteModal.description')}` }}
		</template>
	</DeleteModal>
</template>
<script setup lang="ts">
import { initEmptyIngredient } from '~/constants/ingredient';
import type { IIngredient } from '~/types/ingredient';
import type { Language } from '~/types/translations';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, fetchListingData, deleteIngredient } = useIngredientsOverview();

onMounted(async () => {
	try {
		await fetchListingData();
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
	}
});

const isDeleteModalOpen = ref(false);
const ingredientToDelete = ref(initEmptyIngredient());

const handleCreateIngredient = () => {
	$router.push(localePath('/ingredients/new'));
};
const handleEditIngredient = (id: string) => {
	$router.push(localePath(`/ingredients/${id}/edit`));
};
const handleDeleteIngredient = (ingredient: IIngredient) => {
	ingredientToDelete.value = { ...ingredient };
	isDeleteModalOpen.value = true;
};

const handleCancelDeleteIngredient = () => {
	ingredientToDelete.value = initEmptyIngredient();
};
const handleConfirmDeleteIngredient = async () => {
	try {
		await deleteIngredient(ingredientToDelete.value._id);
		await fetchListingData();
		addToast({ type: 'success', title: 'SUCCESS!', message: 'category deleted' });
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete category' });
	} finally {
		ingredientToDelete.value = initEmptyIngredient();
	}
};
</script>
