<template>
	<NuxtLayout :bg-primary="true">
		<div class="p-6">
			<CategoryForm @cancel="handleCancel" @submit="handleSubmit" />
		</div>
	</NuxtLayout>
</template>
<script setup lang="ts">
import type { ICategoryForm } from '~/types/category';
import { mapFormToCreateCategory } from '~/helpers/categoryMappers';

const { $api, $router } = useNuxtApp();
const { resetFormState } = useCategoryForm();

const handleCancel = () => {
	resetFormState();
	return $router.back();
};
const handleSubmit = async (categoryForm: ICategoryForm) => {
	const createCategory = mapFormToCreateCategory(categoryForm);
	await $api.categories.createCategory(createCategory);
};
</script>
