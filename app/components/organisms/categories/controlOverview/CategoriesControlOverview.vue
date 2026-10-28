<template>
	<ButtonGroup class="p-4">
		<Button @click="handleCreateCategory">
			{{ $t('organisms.categoriesControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.categories"
				:height="containerHeight"
				:item-height="CARD_GRID_METRICS_PX.controlRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<Box
						v-for="{ data: categoryRow, index } in list"
						:key="index"
						direction="row"
						:class="virtualGridRowStyle({ fixedHeight: true })">
						<ItemControlCard
							v-for="category in categoryRow"
							:key="category.id"
							ref="itemControlCard"
							:content="category.translations[$i18n.locale].name"
							@click="() => handleEditCategory(category.id)"
							@action="() => triggerDeleteModal(category)" />
					</Box>
				</template>
				<template #loading>
					<Box
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						direction="row"
						:class="virtualGridRowStyle()">
						<ItemControlCardSkeleton v-for="i in gridColumns" :key="i" />
					</Box>
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
const { overviewState, deleteCategory, loadNextPage } = useCategoriesOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useCategoryDeleteModal();

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};

function useVirtualInfiniteGrid() {
	const containerRef = ref<HTMLDivElement | null>(null);
	const containerHeight = ref(0);
	const gridColumns = computed(() => (screenType.value === 'mobile' ? 1 : 2));

	const updateContainerHeight = () => {
		if (containerRef.value) {
			containerHeight.value = containerRef.value.offsetHeight;
		}
	};

	let resizeObserver: ResizeObserver;
	onMounted(() => {
		resizeObserver = new ResizeObserver(updateContainerHeight);
		if (containerRef.value) {
			resizeObserver.observe(containerRef.value);
		}
	});
	onBeforeUnmount(() => {
		if (containerRef.value) {
			resizeObserver.unobserve(containerRef.value);
		}
		resizeObserver.disconnect();
	});

	return { containerRef, containerHeight, gridColumns };
}

function useCategoryDeleteModal() {
	const isOpen = ref(false);
	const categoryToDelete = ref(initEmptyCategory());

	const modalContent = computed(() => ({
		title: `${t('organisms.categoriesControlOverview.deleteModal.title')} ${categoryToDelete.value.translations[locale.value].name}`,
		description: `${t('organisms.categoriesControlOverview.deleteModal.description')}`
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
			addToast({ type: 'success', title: 'SUCCESS!', message: 'category deleted' });
		} catch {
			addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete category' });
		} finally {
			categoryToDelete.value = initEmptyCategory();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
