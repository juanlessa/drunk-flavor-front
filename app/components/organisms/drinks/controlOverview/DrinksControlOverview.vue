<template>
	<ButtonGroup class="py-4">
		<Button @click="handleCreateDrink">
			{{ $t('organisms.drinksControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.drinks"
				:height="containerHeight"
				:item-height="remToPixels(2.5)"
				:items-gap="remToPixels(1)"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<div
						v-for="{ data: drinkRow, index } in list"
						:key="index"
						class="flex gap-4 justify-center w-full max-w-screen-desktop mx-auto">
						<ItemControlCard
							v-for="drink in drinkRow"
							:key="drink._id"
							ref="itemControlCard"
							:content="drink.translations[$i18n.locale].name"
							@click="() => handleEditDrink(drink._id)"
							@action="() => triggerDeleteModal(drink)" />
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
import { initEmptyDrink } from '~/factories/drink';
import type { Drink } from '~/types/drink';
import { remToPixels } from '~/helpers/sizes';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, deleteDrink, loadNextPage } = useDrinksOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useDrinkDeleteModal();

const handleCreateDrink = () => {
	$router.push(localePath('/drinks/new'));
};
const handleEditDrink = (id: string) => {
	$router.push(localePath(`/drinks/${id}/edit`));
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

function useDrinkDeleteModal() {
	const isOpen = ref(false);
	const drinkToDelete = ref(initEmptyDrink());

	const modalContent = computed(() => ({
		title: `${t('organisms.drinksControlOverview.deleteModal.title')} ${drinkToDelete.value.translations[locale.value].name}`,
		description: `${t('organisms.drinksControlOverview.deleteModal.description')}`
	}));

	const triggerDeleteModal = (drink: Drink) => {
		drinkToDelete.value = { ...drink };
		isOpen.value = true;
	};

	const handleCancel = () => {
		drinkToDelete.value = initEmptyDrink();
	};

	const handleDelete = async () => {
		try {
			await deleteDrink(drinkToDelete.value._id);
			addToast({ type: 'success', title: 'SUCCESS!', message: 'drink deleted' });
		} catch (error) {
			addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete drink' });
			console.error(error);
		} finally {
			drinkToDelete.value = initEmptyDrink();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
