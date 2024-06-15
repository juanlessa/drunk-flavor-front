<template>
	<div class="flex justify-center gap-4 flex-wrap">
		<ItemControlCard
			v-for="category in overviewState.categories"
			:key="category._id"
			:content="category.translations[$i18n.locale as Language].name"
			@click="() => handleEditCategory(category._id)"
			@action="() => console.log('action')" />
	</div>
</template>
<script setup lang="ts">
import type { Language } from '~/types/translations';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { overviewState, getCategories } = useCategoriesOverview();

onMounted(async () => {
	await getCategories();
});

const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};
</script>
