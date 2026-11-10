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

	<div class="relative flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:label="$t('organisms.drinksControlOverview.listLabel')"
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
									$t('organisms.drinksControlOverview.createButton.value')
								"
								@create="handleCreateDrink" />
							<ManagementItemCard
								v-else
								:readonly="!canChange('delete', entry.item)"
								:title="entry.item.translations[locale].name"
								:description="
									$t(
										'organisms.drinksControlOverview.ingredientsCount',
										entry.item.ingredients.length
									)
								"
								@select="handleOpenDrink(entry.item)"
								@delete="triggerDeleteModal(entry.item)">
								<template #media>
									<!-- Decorative: the drink name is right next to it. -->
									<ImageThumbnail
										class="size-11 shrink-0 rounded-control"
										:src="entry.item.thumbnail?.url ?? ''"
										alt=""
										src-fallback="/thumbnail-placeholder.png"
										src-fallback-dark="/thumbnail-placeholder-dark.png" />
								</template>
							</ManagementItemCard>
						</template>
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
import type { Authored } from '~/domain/shared/entity.types';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { $router } = useNuxtApp();
const { locale } = useI18n();
const localePath = useLocalePath();
const { overviewState, searchTerm, isEmpty, deleteDrink, loadNextPage } =
	useDrinksControlOverview();

const { entries, chunk, canChange } = useManagementGroups({
	items: () => overviewState.value.drinks,
	subject: 'Drink',
	searching: () => !!overviewState.value.filter.search
});

const gridColumns = useGridColumns();
const { isOpen, triggerDeleteModal, handleCancel, handleDelete, modalContent } = useDeleteModal({
	i18nPrefix: 'organisms.drinksControlOverview',
	initEmpty: initEmptyDrink,
	getName: (drink, lang) => drink.translations[lang].name,
	remove: deleteDrink
});

const handleCreateDrink = () => {
	$router.push(localePath('/drinks/new'));
};
const handleEditDrink = (id: string) => {
	$router.push(localePath(`/drinks/${id}/edit`));
};
// Drinks of other people open their public page, since there is nothing to edit.
const handleOpenDrink = (drink: Authored<Drink>) => {
	if (canChange('update', drink)) handleEditDrink(drink.id);
	else $router.push(localePath(`/drinks/${drink.id}`));
};
</script>
