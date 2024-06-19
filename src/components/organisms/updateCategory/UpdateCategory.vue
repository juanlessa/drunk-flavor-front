<template>
	<div class="p-6">
		<CategoryForm :category-form="categoryForm" @cancel="handleCancel" @submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import { mapCategoryToForm, mapFormToUpdateCategory } from '~/helpers/categoryMappers';
import type { CategoryForm } from '~/types/category';

const props = defineProps({
	categoryId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();

const { resetFormState } = useCategoryForm();
const { addToast } = useToast();

const categoryForm = ref<CategoryForm | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.categories.getCategory(props.categoryId));

if (error.value) {
	console.error('Failed to fetch category:', error.value);
}
if (data.value) {
	categoryForm.value = mapCategoryToForm(data.value);
}

const handleCancel = () => {
	resetFormState();
	$router.back();
};
const handleSubmit = async (categoryForm: CategoryForm) => {
	const updateCategory = mapFormToUpdateCategory(props.categoryId, categoryForm);
	try {
		await $api.categories.updateCategory(updateCategory);
		addToast({ type: 'success', title: 'Success', message: 'category has been updated' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'category has been updated' });
	}
};
</script>
