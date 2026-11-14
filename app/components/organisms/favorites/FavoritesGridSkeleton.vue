<template>
	<!-- Same grid and card height as the list, so the page does not jump when the drinks arrive. -->
	<ul
		class="grid list-none grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3"
		aria-hidden="true"
		data-testid="favorites-loading">
		<li
			v-for="index in props.count"
			:key="index"
			class="flex h-(--drink-row-height) [&>*]:max-w-none"
			:style="rowHeightStyle">
			<DrinkCardSkeleton />
		</li>
	</ul>
</template>
<script setup lang="ts">
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';
const props = defineProps({
	count: { type: Number, default: 6 }
});
const rowHeightStyle = { '--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px` };
</script>
