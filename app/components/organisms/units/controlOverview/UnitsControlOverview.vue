<template>
	<ButtonGroup class="p-4">
		<Button @click="handleCreateUnit">
			{{ $t('organisms.unitsControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>
	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.units"
				:height="containerHeight"
				:item-height="CARD_GRID_METRICS_PX.controlRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<Box
						v-for="{ data: unitRow, index } in list"
						:key="index"
						direction="row"
						:class="virtualGridRowStyle({ fixedHeight: true })">
						<ItemControlCard
							v-for="unit in unitRow"
							:key="unit.id"
							ref="itemControlCard"
							:content="unit.translations[$i18n.locale].name"
							@click="() => handleEditUnit(unit.id)"
							@action="() => triggerDeleteModal(unit)" />
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
import { initEmptyUnit } from '~/domain/unit/unit.factory';
import type { Unit } from '~/domain/unit/unit.entity';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, deleteUnit, loadNextPage } = useUnitsOverview();
const { screenType } = useScreenType();
const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useUnitDeleteModal();

const handleCreateUnit = () => {
	$router.push(localePath('/units/new'));
};

const handleEditUnit = (id: string) => {
	$router.push(localePath(`/units/${id}/edit`));
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

function useUnitDeleteModal() {
	const isOpen = ref(false);
	const unitToDelete = ref(initEmptyUnit());

	const modalContent = computed(() => ({
		title: `${t('organisms.unitsControlOverview.deleteModal.title')} ${unitToDelete.value.translations[locale.value].name}`,
		description: `${t('organisms.unitsControlOverview.deleteModal.description')}`
	}));

	const triggerDeleteModal = (unit: Unit) => {
		unitToDelete.value = { ...unit };
		isOpen.value = true;
	};

	const handleCancel = () => {
		unitToDelete.value = initEmptyUnit();
	};

	const handleDelete = async () => {
		try {
			await deleteUnit(unitToDelete.value.id);
			addToast({ type: 'success', title: 'SUCCESS!', message: 'unit deleted' });
		} catch {
			addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete unit' });
		} finally {
			unitToDelete.value = initEmptyUnit();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
