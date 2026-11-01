<template>
	<ManagementToolbar
		v-model:search-term="searchTerm"
		search-id="drinks-search"
		:search-label="$t('organisms.drinksControlOverview.searchLabel')"
		:search-placeholder="$t('organisms.drinksControlOverview.searchPlaceholder')"
		:create-label="$t('organisms.drinksControlOverview.createButton.value')"
		@create="handleCreateDrink" />

	<Text v-if="isEmpty" class="px-4 py-8 text-center text-content-muted">
		{{ $t('organisms.drinksControlOverview.emptyMessage') }}
	</Text>

	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.drinks"
				:height="containerHeight"
				:item-height="CARD_GRID_METRICS_PX.managementRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<div
						v-for="{ data: drinkRow, index } in list"
						:key="index"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCard
							v-for="drink in drinkRow"
							:key="drink.id"
							:title="drink.translations[locale].name"
							:description="
								$t(
									'organisms.drinksControlOverview.ingredientsCount',
									drink.ingredients.length
								)
							"
							@select="handleEditDrink(drink.id)"
							@delete="triggerDeleteModal(drink)">
							<template #media>
								<!-- Decorative: the drink name is right next to it. -->
								<ImageThumbnail
									class="size-11 shrink-0 rounded-control"
									:src="drink.thumbnail?.url ?? ''"
									alt=""
									src-fallback="/thumbnail-placeholder.png"
									src-fallback-dark="/thumbnail-placeholder-dark.png" />
							</template>
						</ManagementItemCard>
					</div>
				</template>
				<template #loading>
					<div
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCardSkeleton v-for="i in gridColumns" :key="i" media />
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
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import type { Drink } from '~/domain/drink/drink.entity';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, searchTerm, isEmpty, deleteDrink, loadNextPage } =
	useDrinksControlOverview();
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

function useDrinkDeleteModal() {
	const isOpen = ref(false);
	const drinkToDelete = ref(initEmptyDrink());

	const modalContent = computed(() => ({
		title: t('organisms.drinksControlOverview.deleteModal.title', {
			name: drinkToDelete.value.translations[locale.value].name
		}),
		description: t('organisms.drinksControlOverview.deleteModal.description')
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
			await deleteDrink(drinkToDelete.value.id);
			addToast({
				type: 'success',
				title: t('organisms.drinksControlOverview.deleteSuccess.title'),
				message: t('organisms.drinksControlOverview.deleteSuccess.message')
			});
		} catch {
			addToast({
				type: 'error',
				title: t('organisms.drinksControlOverview.deleteError.title'),
				message: t('organisms.drinksControlOverview.deleteError.message')
			});
		} finally {
			drinkToDelete.value = initEmptyDrink();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
