<template>
	<NuxtLayout :bg-primary="true">
		<div class="p-6">
			<CategoryForm
				:category-form="categoryForm"
				@cancel="handleCancel"
				@submit="handleSubmit" />
		</div>
	</NuxtLayout>
</template>
<script setup lang="ts">
import { mapCategoryToForm, mapFormToUpdateCategory } from '~/helpers/categoryMappers';
import type { ICategoryForm } from '~/types/category';

const categoryForm = ref<ICategoryForm | undefined>(undefined);

const { $api, $router } = useNuxtApp();
const route = useRoute();
const { resetFormState } = useCategoryForm();

const categoryId = route.params.id as string;

const { data, error } = await useAsyncData(() => $api.categories.getCategory(categoryId));

if (error.value) {
	console.error('Failed to fetch category:', error.value);
}
if (data.value) {
	categoryForm.value = mapCategoryToForm(data.value);
}

const handleCancel = () => {
	resetFormState();
	return $router.back();
};
const handleSubmit = async (categoryForm: ICategoryForm) => {
	const updateCategory = mapFormToUpdateCategory(categoryId, categoryForm);
	await $api.categories.updateCategory(updateCategory);
};
</script>
