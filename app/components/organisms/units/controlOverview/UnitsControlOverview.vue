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
				:items="entries"
				:chunk="chunk"
				:item-height="CARD_GRID_METRICS_PX.managementRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				:can-load-more="!overviewState.filter.isLastPage"
				@load-more="loadNextPage">
				<template #default="{ list, rowAttrs }">
					<div
						v-for="{ data: row, index } in list"
						:key="index"
						v-bind="rowAttrs(index)"
						:class="virtualGridRowStyle({ fixedHeight: true, columns: true })">
						<template v-for="entry in row" :key="entry.key">
							<ManagementGroupRow
								v-if="entry.kind === 'header'"
								variant="header"
								:group="entry.group" />
							<ManagementGroupRow
								v-else-if="entry.kind === 'empty-own'"
								variant="empty-own"
								:create-label="
									$t('organisms.unitsControlOverview.createButton.value')
								"
								@create="handleCreateUnit" />
							<ManagementItemCard
								v-else
								:selectable="canChange('update', entry.item)"
								:readonly="!canChange('delete', entry.item)"
								:title="entry.item.translations[locale].name"
								:description="
									getUnitSummary(
										entry.item,
										$t(
											`organisms.unitsControlOverview.kinds.${entry.item.kind}`
										)
									)
								"
								@select="handleEditUnit(entry.item.id)"
								@delete="triggerDeleteModal(entry.item)" />
						</template>
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
import { getUnitSummary } from '~/helpers/unit.helpers';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { locale } = useI18n();
const localePath = useLocalePath();
const { overviewState, searchTerm, isEmpty, deleteUnit, loadNextPage } = useUnitsOverview();

const { entries, chunk, canChange } = useManagementGroups({
	items: () => overviewState.value.units,
	subject: 'Unit',
	searching: () => !!overviewState.value.filter.search
});

const gridColumns = useGridColumns();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } = useDeleteModal({
	i18nPrefix: 'organisms.unitsControlOverview',
	initEmpty: initEmptyUnit,
	getName: (unit, lang) => unit.translations[lang].name,
	remove: deleteUnit
});

const handleCreateUnit = () => {
	$router.push(localePath('/units/new'));
};
const handleEditUnit = (id: string) => {
	$router.push(localePath(`/units/${id}/edit`));
};
</script>
