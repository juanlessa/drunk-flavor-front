<template>
	<ButtonGroup class="py-4">
		<Button @click="handleCreateIngredient">
			{{ $t('organisms.ingredientsControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.ingredients"
				:height="containerHeight"
				:item-height="remToPixels(2.5)"
				:items-gap="remToPixels(1)"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<div
						v-for="{ data: ingredientRow, index } in list"
						:key="index"
						class="flex gap-4 justify-center w-full max-w-screen-desktop mx-auto">
						<ItemControlCard
							v-for="ingredient in ingredientRow"
							:key="ingredient._id"
							ref="itemControlCard"
							:content="ingredient.translations[$i18n.locale].name"
							@click="() => handleEditIngredient(ingredient._id)"
							@action="() => triggerDeleteModal(ingredient)" />
					</div>
				</template>
				<template #loading>
					<div
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						class="flex gap-4 justify-center w-full max-w-screen-desktop mx-auto">
						<ItemControlCardSkeleton v-for="i in gridColumns" :key="i" />
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
import { initEmptyIngredient } from '~/factories/ingredient';
import type { Ingredient } from '~/types/ingredient';
import { remToPixels } from '~/helpers/sizes';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, deleteIngredient, loadNextPage } = useIngredientsOverview();
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

function useIngredientDeleteModal() {
	const isOpen = ref(false);
	const ingredientToDelete = ref(initEmptyIngredient());

	const modalContent = computed(() => ({
		title: `${t('organisms.ingredientsControlOverview.deleteModal.title')} ${ingredientToDelete.value.translations[locale.value].name}`,
		description: `${t('organisms.ingredientsControlOverview.deleteModal.description')}`
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
			await deleteIngredient(ingredientToDelete.value._id);
			addToast({ type: 'success', title: 'SUCCESS!', message: 'ingredient deleted' });
		} catch (error) {
			addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete ingredient' });
		} finally {
			ingredientToDelete.value = initEmptyIngredient();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
