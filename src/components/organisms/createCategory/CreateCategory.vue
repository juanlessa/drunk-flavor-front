<template>
	<div class="p-6">
		<CategoryForm @cancel="handleCancel" @submit="handleSubmit" />
	</div>
</template>
<script setup lang="ts">
import type { CategoryForm } from '~/types/category';
import { mapFormToCreateCategory } from '~/helpers/categoryMappers';

const { $api, $router } = useNuxtApp();
const { resetFormState } = useCategoryForm();
const { addToast } = useToast();

const handleCancel = () => {
	resetFormState();
	return $router.back();
};
const handleSubmit = async (categoryForm: CategoryForm) => {
	const createCategory = mapFormToCreateCategory(categoryForm);
	try {
		await $api.categories.createCategory(createCategory);
		addToast({ type: 'success', title: 'Success', message: 'category has been created' });
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'category has not been created' });
	}
};
</script>
