<template>
	<CategoryForm
		v-if="categoryForm && canUpdate"
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
const localePath = useLocalePath();
const { addToast } = useToast();

// Read with authorship: only who may change the record gets the form, anyone else is sent to the read-only view.
const {
	record: category,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `category-edit-${props.categoryId}`,
	subject: 'Category',
	fetch: () => $api.categories.getWithAuthorship(props.categoryId)
});
const categoryForm = computed(() =>
	category.value ? mapCategoryToForm(category.value) : undefined
);

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch category:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed === false) $router.replace(localePath(`/categories/${props.categoryId}`));
	},
	{ immediate: true }
);

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
