<template>
	<CategoryForm
		:title="$t('organisms.categoryForm.createTitle')"
		:submit-label="$t('organisms.categoryForm.createButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import type { CategoryForm } from '~/types/category.types';
import { mapFormToCreateCategory } from '~/mappers/category.mappers';

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();

const handleCancel = () => {
	$router.back();
};

const handleSubmit = async (categoryForm: CategoryForm) => {
	const createCategory = mapFormToCreateCategory(categoryForm);
	try {
		await $api.categories.create(createCategory);
		addToast({
			type: 'success',
			title: t('organisms.categoryForm.createSuccess.title'),
			message: t('organisms.categoryForm.createSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.categoryForm.createError.title'),
			message: t('organisms.categoryForm.createError.message')
		});
		console.error(error);
	}
};
</script>
