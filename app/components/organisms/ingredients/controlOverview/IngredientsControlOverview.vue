<template>
	<ManagementToolbar
		v-model:search-term="searchTerm"
		search-id="ingredients-search"
		:search-label="$t('organisms.ingredientsControlOverview.searchLabel')"
		:search-placeholder="$t('organisms.ingredientsControlOverview.searchPlaceholder')"
		:create-label="$t('organisms.ingredientsControlOverview.createButton.value')"
		@create="handleCreateIngredient" />

	<Text v-if="isEmpty" class="px-4 py-8 text-center text-content-muted">
		{{ $t('organisms.ingredientsControlOverview.emptyMessage') }}
	</Text>

	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.ingredients"
				:height="containerHeight"
				:item-height="CARD_GRID_METRICS_PX.managementRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<div
						v-for="{ data: ingredientRow, index } in list"
						:key="index"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCard
							v-for="ingredient in ingredientRow"
							:key="ingredient.id"
							:title="ingredient.translations[locale].name"
							:description="getIngredientSummary(ingredient, locale)"
							@select="handleEditIngredient(ingredient.id)"
							@delete="triggerDeleteModal(ingredient)" />
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
import { initEmptyIngredient } from '~/domain/ingredient/ingredient.factory';
import type { Ingredient } from '~/domain/ingredient/ingredient.entity';
import { getIngredientSummary } from '~/helpers/ingredient.helpers';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, searchTerm, isEmpty, deleteIngredient, loadNextPage } =
	useIngredientsOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useIngredientDeleteModal();

const handleCreateIngredient = () => {
	$router.push(localePath('/ingredients/new'));
};
const handleEditIngredient = (id: string) => {
	$router.push(localePath(`/ingredients/${id}/edit`));
};

function useVirtualInfiniteGrid() {
	const containerRef = ref<HTMLDivElement | null>(null);
	const containerHeight = ref(0);
	const gridColumns = computed(() => {
		if (screenType.value === 'mobile') return 1;
		if (screenType.value === 'tablet') return 2;
		return 3;
	});

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

function useIngredientDeleteModal() {
	const isOpen = ref(false);
	const ingredientToDelete = ref(initEmptyIngredient());

	const modalContent = computed(() => ({
		title: t('organisms.ingredientsControlOverview.deleteModal.title', {
			name: ingredientToDelete.value.translations[locale.value].name
		}),
		description: t('organisms.ingredientsControlOverview.deleteModal.description')
	}));

	const triggerDeleteModal = (ingredient: Ingredient) => {
		ingredientToDelete.value = { ...ingredient };
		isOpen.value = true;
	};

	const handleCancel = () => {
		ingredientToDelete.value = initEmptyIngredient();
	};

	const handleDelete = async () => {
		try {
			await deleteIngredient(ingredientToDelete.value.id);
			addToast({
				type: 'success',
				title: t('organisms.ingredientsControlOverview.deleteSuccess.title'),
				message: t('organisms.ingredientsControlOverview.deleteSuccess.message')
			});
		} catch {
			addToast({
				type: 'error',
				title: t('organisms.ingredientsControlOverview.deleteError.title'),
				message: t('organisms.ingredientsControlOverview.deleteError.message')
			});
		} finally {
			ingredientToDelete.value = initEmptyIngredient();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
