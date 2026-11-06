<template>
	<div ref="containerRef" class="relative flex-1">
		<!-- The page is a visual grid with no display heading, so the required h1 is screen-reader only. -->
		<Heading as="h1" class="sr-only">{{ $t('organisms.drinksOverview.heading') }}</Heading>
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.drinks"
				:height="containerHeight"
				:item-height="CARD_GRID_METRICS_PX.drinkRowHeight"
				:items-gap="CARD_GRID_METRICS_PX.gap"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<Box
						v-for="{ data: drinkRow, index } in list"
						:key="index"
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
				Clipped inside the container, so it never changes the page height.
			-->
			<template #fallback>
				<div class="absolute inset-0 overflow-hidden px-4">
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
import {
	CARD_GRID_METRICS_PX,
	virtualGridRowStyle
} from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const { overviewState, loadNextPage } = await useDrinksOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();

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
</script>
