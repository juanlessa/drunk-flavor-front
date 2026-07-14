<template>
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
						<DrinkCard
							v-for="drink in drinkRow"
							:key="drink._id"
							:drink="drink" />
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
</template>
<script setup lang="ts">
import { remToPixels } from '~/helpers/sizes';

const { overviewState, loadNextPage } = useDrinksOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();

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
</script>
