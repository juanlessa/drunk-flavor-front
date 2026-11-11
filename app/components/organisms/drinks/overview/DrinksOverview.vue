<template>
	<!-- The page is a visual grid with no display heading, so the required h1 is screen-reader only. -->
	<Heading as="h1" class="sr-only">{{ $t('organisms.drinksOverview.heading') }}</Heading>
	<SearchSortToolbar
		v-model:search-term="searchTerm"
		v-model:sort="sort"
		search-id="drinks-search"
		sort-id="drinks-sort"
		:search-label="$t('organisms.drinksOverview.searchLabel')"
		:search-placeholder="$t('organisms.drinksOverview.searchPlaceholder')"
		:sort-label="$t('organisms.drinksOverview.sortLabel')"
		:sort-options="sortOptions" />
	<!-- The API gives no total, so there is no count: the list only says when it has nothing to show. -->
	<Text v-if="isEmpty" role="status" class="px-4 py-8 text-center text-content-muted">
		{{
			isSearching
				? $t('organisms.drinksOverview.emptySearchMessage', { term: searchTerm.trim() })
				: $t('organisms.drinksOverview.emptyMessage')
		}}
	</Text>
	<div class="relative flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:label="$t('organisms.drinksOverview.listLabel')"
				:items="overviewState.drinks"
				:item-height="CARD_GRID_METRICS_PX.drinkRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				:can-load-more="!overviewState.filter.isLastPage"
				@load-more="loadNextPage">
				<template #default="{ list, rowAttrs }">
					<Box
						v-for="{ data: drinkRow, index } in list"
						:key="index"
						v-bind="rowAttrs(index)"
						direction="row"
						:class="virtualGridRowStyle({ fixedHeight: true })">
						<DrinkCard v-for="drink in drinkRow" :key="drink.id" :drink="drink" />
					</Box>
				</template>
				<template #loading>
					<Box
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						direction="row"
						:class="virtualGridRowStyle({ fixedHeight: true })">
						<DrinkCardSkeleton v-for="i in gridColumns" :key="i" />
					</Box>
				</template>
			</VirtualInfiniteGrid>
			<!--
				Server-rendered first page, so the drinks are real links in the HTML that search engines read.
				The virtual grid needs the browser to measure its height, so it takes over after mount.

				It has to match the grid's geometry, or the cards visibly jump when the grid replaces it:
				- The wrapper has the same side padding as the grid's wrapper, and the list the same
				  maximum width as a grid row.
				- Each item is as wide as a card in the grid, using the same size tokens: DrinkCard caps
				  its width at a share of the whole row (45% on tablet, 30% on desktop). That percentage
				  only works when the card sits directly in the row, so it is dropped here (`max-w-none`)
				  and the item width, a share of the same row, does the job.
				- Items wrap and are centered like the grid's rows (`justify-center`), so an incomplete
				  last row sits in the middle instead of against the left edge. The number of columns is
				  not known on the server, so the wrapping itself decides it from the item widths.
				It stays in the flow, because the page scrolls and the list takes its height from its rows: with
				the same geometry the grid has the same height, so the footer does not move when it takes over.
			-->
			<template #fallback>
				<div class="px-4">
					<ul
						class="mx-auto flex w-full max-w-screen-desktop list-none flex-wrap content-start justify-center gap-4 [&>li>*]:max-w-none">
						<li
							v-for="drink in overviewState.drinks"
							:key="drink.id"
							class="flex h-[var(--drink-row-height)] w-full tablet:w-[var(--size-drink-card-tablet-max-inline)] desktop:w-[var(--size-drink-card-desktop-max-inline)]"
							:style="{
								'--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px`
							}">
							<DrinkCard :drink="drink" />
						</li>
					</ul>
				</div>
			</template>
		</ClientOnly>
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';
import { drinkListSorts } from '~/domain/drink/drink.constants';

const { t } = useI18n();
const { overviewState, searchTerm, sort, isSearching, isEmpty, loadNextPage } =
	await useDrinksOverview();

const gridColumns = useGridColumns();
const sortOptions = computed<InputSelectOption[]>(() =>
	drinkListSorts.map((option) => ({
		value: option,
		label: t(`organisms.drinksOverview.sortOptions.${option}`)
	}))
);
</script>
