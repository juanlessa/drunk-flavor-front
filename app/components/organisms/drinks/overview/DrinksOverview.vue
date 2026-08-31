<template>
	<div ref="containerRef" class="flex-1">
		<ClientOnly>
			<VirtualInfiniteGrid
				:items="overviewState.drinks"
				:height="containerHeight"
				:item-height="remToPixels(9.5)"
				:items-gap="remToPixels(1)"
				:grid-columns="gridColumns"
				:loading="overviewState.loading"
				@load-more="loadNextPage">
				<template #default="{ list }">
					<Box
						v-for="{ data: drinkRow, index } in list"
						:key="index"
						direction="row"
						class="gap-4 justify-center w-full max-w-screen-desktop mx-auto"
						:style="{ height: `${remToPixels(9.5)}px` }">
						<DrinkCard
							v-for="drink in drinkRow"
							:key="drink._id"
							:drink="drink"
							@click="() => handleDrinkClick(drink._id)" />
					</Box>
				</template>
				<template #loading>
					<Box
						v-for="idx in Math.ceil(overviewState.filter.limit / gridColumns)"
						:key="idx"
						direction="row"
						class="gap-4 justify-center w-full max-w-screen-desktop mx-auto">
						<ItemControlCardSkeleton v-for="i in gridColumns" :key="i" />
					</Box>
				</template>
			</VirtualInfiniteGrid>
		</ClientOnly>
	</div>
</template>
<script setup lang="ts">
import { remToPixels } from '~/helpers/sizes';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { overviewState, loadNextPage } = useDrinksOverview();
const { screenType } = useScreenType();

const { containerRef, containerHeight, gridColumns } = useVirtualInfiniteGrid();

const handleDrinkClick = (id: string) => {
	$router.push(localePath(`/drinks/${id}`));
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
</script>
