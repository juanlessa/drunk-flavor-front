<template>
	<ManagementToolbar
		v-model:search-term="searchTerm"
		search-id="units-search"
		:search-label="$t('organisms.unitsControlOverview.searchLabel')"
		:search-placeholder="$t('organisms.unitsControlOverview.searchPlaceholder')"
		:create-label="$t('organisms.unitsControlOverview.createButton.value')"
		@create="handleCreateUnit" />

	<Text v-if="isEmpty" class="px-4 py-8 text-center text-content-muted">
		{{ $t('organisms.unitsControlOverview.emptyMessage') }}
	</Text>

	<div class="relative flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:label="$t('organisms.unitsControlOverview.listLabel')"
				:items="overviewState.units"
				:item-height="CARD_GRID_METRICS_PX.managementRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				:can-load-more="!overviewState.filter.isLastPage"
				@load-more="loadNextPage">
				<template #default="{ list, rowAttrs }">
					<div
						v-for="{ data: unitRow, index } in list"
						:key="index"
						v-bind="rowAttrs(index)"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<ManagementItemCard
							v-for="unit in unitRow"
							:key="unit.id"
							:title="unit.translations[locale].name"
							:description="
								getUnitSummary(
									unit,
									$t(`organisms.unitsControlOverview.kinds.${unit.kind}`)
								)
							"
							@select="handleEditUnit(unit.id)"
							@delete="triggerDeleteModal(unit)" />
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
import { initEmptyUnit } from '~/domain/unit/unit.factory';
import type { Unit } from '~/domain/unit/unit.entity';
import { getUnitSummary } from '~/helpers/unit.helpers';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, searchTerm, isEmpty, deleteUnit, loadNextPage } = useUnitsOverview();

const gridColumns = useGridColumns();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } =
	useUnitDeleteModal();

const handleCreateUnit = () => {
	$router.push(localePath('/units/new'));
};
const handleEditUnit = (id: string) => {
	$router.push(localePath(`/units/${id}/edit`));
};

function useUnitDeleteModal() {
	const isOpen = ref(false);
	const unitToDelete = ref(initEmptyUnit());

	const modalContent = computed(() => ({
		title: t('organisms.unitsControlOverview.deleteModal.title', {
			name: unitToDelete.value.translations[locale.value].name
		}),
		description: t('organisms.unitsControlOverview.deleteModal.description')
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
			addToast({
				type: 'success',
				title: t('organisms.unitsControlOverview.deleteSuccess.title'),
				message: t('organisms.unitsControlOverview.deleteSuccess.message')
			});
		} catch {
			addToast({
				type: 'error',
				title: t('organisms.unitsControlOverview.deleteError.title'),
				message: t('organisms.unitsControlOverview.deleteError.message')
			});
		} finally {
			unitToDelete.value = initEmptyUnit();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
}
</script>
