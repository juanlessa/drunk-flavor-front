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
									$t('organisms.categoriesControlOverview.createButton.value')
								"
								@create="handleCreateCategory" />
							<ManagementItemCard
								v-else
								:readonly="!canChange('delete', entry.item)"
								:title="entry.item.translations[locale].name"
								:description="
									$t(
										`organisms.categoriesControlOverview.${entry.item.isAlcoholic ? 'alcoholic' : 'nonAlcoholic'}`
									)
								"
								@select="handleOpenCategory(entry.item)"
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
import { initEmptyCategory } from '~/domain/category/category.factory';
import type { Category } from '~/domain/category/category.entity';
import type { Authored } from '~/domain/shared/entity.types';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { locale } = useI18n();
const localePath = useLocalePath();
const { overviewState, searchTerm, isEmpty, deleteCategory, loadNextPage } =
	useCategoriesOverview();

const { entries, chunk, canChange } = useManagementGroups({
	items: () => overviewState.value.categories,
	subject: 'Category',
	searching: () => !!overviewState.value.filter.search
});

const gridColumns = useGridColumns();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } = useDeleteModal({
	i18nPrefix: 'organisms.categoriesControlOverview',
	initEmpty: initEmptyCategory,
	getName: (category, lang) => category.translations[lang].name,
	remove: deleteCategory
});

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};
// Records of other people open their read-only view, since there is nothing to edit.
const handleOpenCategory = (category: Authored<Category>) => {
	if (canChange('update', category)) handleEditCategory(category.id);
	else $router.push(localePath(`/categories/${category.id}`));
};
</script>
