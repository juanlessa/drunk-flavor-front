<template>
	<div class="flex justify-center gap-4 flex-wrap">
		<ItemControlCard
			v-for="category in overviewState.categories"
			:key="category._id"
			:content="category.translations[$i18n.locale as Language].name"
			@click="() => handleEditCategory(category._id)"
			@action="() => console.log('action')" />

		<template v-if="!overviewState.loading">
			<ItemControlCardSkeleton
				v-for="idx in Array.from({ length: 40 }, (_, i) => i)"
				:key="idx" />
		</template>
	</div>
</template>
<script setup lang="ts">
import type { Language } from '~/types/translations';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, fetchListingData } = useCategoriesOverview();

onMounted(async () => {
	try {
		await fetchListingData();
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'unable to fetch data' });
	}
});

const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};
</script>
