<template>
	<div ref="containerRef" class="relative flex-1">
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
				Clipped inside the container, so it never changes the page height.
			-->
			<template #fallback>
				<ul
					class="absolute inset-0 mx-auto grid w-full max-w-screen-desktop list-none grid-cols-1 content-start gap-4 overflow-hidden px-4 tablet:grid-cols-2 desktop:grid-cols-3">
					<li
						v-for="drink in overviewState.drinks"
						:key="drink.id"
						class="flex h-[var(--drink-row-height)] justify-center"
						:style="{
							'--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px`
						}">
						<DrinkCard :drink="drink" />
					</li>
				</ul>
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
