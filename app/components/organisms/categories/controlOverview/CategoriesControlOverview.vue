<template>
	<ManagementToolbar
		v-model:search-term="searchTerm"
		search-id="categories-search"
		:search-label="$t('organisms.categoriesControlOverview.searchLabel')"
		:search-placeholder="$t('organisms.categoriesControlOverview.searchPlaceholder')"
		:create-label="$t('organisms.categoriesControlOverview.createButton.value')"
		@create="handleCreateCategory" />

	<Text v-if="isEmpty" class="px-4 py-8 text-center text-content-muted">
		{{ $t('organisms.categoriesControlOverview.emptyMessage') }}
	</Text>

	<div class="relative flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:label="$t('organisms.categoriesControlOverview.listLabel')"
				:items="overviewState.categories"
				:item-height="CARD_GRID_METRICS_PX.managementRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				:can-load-more="!overviewState.filter.isLastPage"
				@load-more="loadNextPage">
				<template #default="{ list, rowAttrs }">
					<div
						v-for="{ data: categoryRow, index } in list"
						:key="index"
						v-bind="rowAttrs(index)"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCard
							v-for="category in categoryRow"
							:key="category.id"
							:title="category.translations[locale].name"
							:description="
								$t(
									`organisms.categoriesControlOverview.${category.isAlcoholic ? 'alcoholic' : 'nonAlcoholic'}`
								)
							"
							@select="handleEditCategory(category.id)"
							@delete="triggerDeleteModal(category)" />
					</div>
				</template>
				<template #loading>
					<div
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCardSkeleton v-for="i in gridColumns" :key="i" />
					</div>
				</template>
			</VirtualInfiniteGrid>
		</ClientOnly>
	</div>

	<DeleteModal v-model:open="isOpen" @cancel="handleCancel" @delete="handleDelete">
		<template #title>{{ modalContent.title }}</template>
		<template #description>{{ modalContent.description }}</template>
	</DeleteModal>
</template>
<script setup lang="ts">
import { initEmptyCategory } from '~/domain/category/category.factory';
import type { Category } from '~/domain/category/category.entity';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, searchTerm, isEmpty, deleteCategory, loadNextPage } =
	useCategoriesOverview();

const gridColumns = useGridColumns();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useCategoryDeleteModal();

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};

function useCategoryDeleteModal() {
	const isOpen = ref(false);
	const categoryToDelete = ref(initEmptyCategory());

	const modalContent = computed(() => ({
		title: t('organisms.categoriesControlOverview.deleteModal.title', {
			name: categoryToDelete.value.translations[locale.value].name
		}),
		description: t('organisms.categoriesControlOverview.deleteModal.description')
	}));

	const triggerDeleteModal = (category: Category) => {
		categoryToDelete.value = { ...category };
		isOpen.value = true;
	};

	const handleCancel = () => {
		categoryToDelete.value = initEmptyCategory();
	};

	const handleDelete = async () => {
		try {
			await deleteCategory(categoryToDelete.value.id);
			addToast({
				type: 'success',
				title: t('organisms.categoriesControlOverview.deleteSuccess.title'),
				message: t('organisms.categoriesControlOverview.deleteSuccess.message')
			});
		} catch {
			addToast({
				type: 'error',
				title: t('organisms.categoriesControlOverview.deleteError.title'),
				message: t('organisms.categoriesControlOverview.deleteError.message')
			});
		} finally {
			categoryToDelete.value = initEmptyCategory();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
