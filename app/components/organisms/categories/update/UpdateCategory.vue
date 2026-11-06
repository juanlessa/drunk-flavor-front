<template>
	<CategoryForm
		:category-form="categoryForm"
		:title="$t('organisms.categoryForm.editTitle')"
		:submit-label="$t('organisms.categoryForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapCategoryToForm, mapFormToUpdateCategory } from '~/mappers/category.mappers';
import type { CategoryForm } from '~/types/category.types';

const props = defineProps({
	categoryId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();

const categoryForm = ref<CategoryForm | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.categories.get(props.categoryId));

if (error.value) {
	console.error('Failed to fetch category:', error.value);
}

if (data.value) {
	categoryForm.value = mapCategoryToForm(data.value);
}

const handleCancel = () => {
	$router.back();
};

const handleSubmit = async (categoryForm: CategoryForm) => {
	const updateCategory = mapFormToUpdateCategory(props.categoryId, categoryForm);
	try {
		await $api.categories.update(updateCategory);
		addToast({
			type: 'success',
			title: t('organisms.categoryForm.updateSuccess.title'),
			message: t('organisms.categoryForm.updateSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.categoryForm.updateError.title'),
			message: t('organisms.categoryForm.updateError.message')
		});
		console.error(error);
	}
};
</script>
