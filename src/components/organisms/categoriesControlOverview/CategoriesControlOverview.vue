<template>
	<ButtonGroup class="py-4">
		<Button @click="handleCreateCategory">
			{{ $t('organisms.categoriesControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div class="flex justify-center gap-4 flex-wrap">
		<ItemControlCard
			v-for="category in overviewState.categories"
			:key="category._id"
			:content="category.translations[$i18n.locale as Language].name"
			@click="() => handleEditCategory(category._id)"
			@action="() => handleDeleteCategory(category)" />

		<template v-if="overviewState.loading">
			<ItemControlCardSkeleton
				v-for="idx in Array.from({ length: 40 }, (_, i) => i)"
				:key="idx" />
		</template>
	</div>
	<DeleteModal
		v-model:open="isDeleteModalOpen"
		@cancel="handleCancelDeleteCategory"
		@delete="handleConfirmDeleteCategory">
		<template #title>
			{{
				`${$t('organisms.categoriesControlOverview.deleteModal.title')} ${categoryToDelete.translations[$i18n.locale as Language].name}`
			}}
		</template>
		<template #description>
			{{ `${$t('organisms.categoriesControlOverview.deleteModal.description')}` }}
		</template>
	</DeleteModal>
</template>
<script setup lang="ts">
import { initEmptyCategory } from '~/constants/category';
import type { ICategory } from '~/types/category';
import type { Language } from '~/types/translations';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, fetchListingData, deleteCategory } = useCategoriesOverview();

onMounted(async () => {
	try {
		await fetchListingData();
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
	}
});

const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(initEmptyCategory());

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};
const handleDeleteCategory = (category: ICategory) => {
	categoryToDelete.value = { ...category };
	isDeleteModalOpen.value = true;
};

const handleCancelDeleteCategory = () => {
	categoryToDelete.value = initEmptyCategory();
};
const handleConfirmDeleteCategory = async () => {
	try {
		await deleteCategory(categoryToDelete.value._id);
		await fetchListingData();
		addToast({ type: 'success', title: 'SUCCESS!', message: 'category deleted' });
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete category' });
	} finally {
		categoryToDelete.value = initEmptyCategory();
	}
};
</script>
