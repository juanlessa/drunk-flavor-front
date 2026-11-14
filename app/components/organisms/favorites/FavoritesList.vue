<template>
	<FavoritesGridSkeleton v-if="!hasLoaded && !hasLoadError" />
	<section
		v-else-if="hasLoadError"
		class="flex flex-col items-center gap-3 rounded-card border border-stroke bg-surface px-6 py-10 text-center shadow-card"
		role="alert"
		data-testid="favorites-error">
		<h2 class="text-title-sm font-bold text-content">
			{{ $t('organisms.favorites.loadError.title') }}
		</h2>
		<p class="max-w-sm text-body text-content-secondary">
			{{ $t('organisms.favorites.loadError.message') }}
		</p>
		<Button variant="primary" class="mt-2" @click="load">
			{{ $t('organisms.favorites.loadError.retry') }}
		</Button>
	</section>
	<FavoritesEmpty v-else-if="items.length === 0" />
	<section v-else :aria-labelledby="titleId" class="flex min-w-0 flex-col gap-4">
		<h2 :id="titleId" class="sr-only">{{ $t('organisms.favorites.listLabel') }}</h2>
		<ul
			class="grid list-none grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3"
			:aria-busy="loading">
			<li
				v-for="item in items"
				:key="item.id"
				class="flex h-(--drink-row-height) [&>*]:max-w-none"
				:style="rowHeightStyle">
				<DrinkCard :drink="item.drink" />
			</li>
		</ul>
		<FavoritesGridSkeleton v-if="loading" :count="3" />
		<!-- Loads the next page as it scrolls into view; the button also works with a keyboard or a click. -->
		<div v-if="canLoadMore" ref="sentinel" class="flex justify-center">
			<Button variant="secondary" size="sm" @click="loadMore">
				{{ $t('organisms.favorites.loadMore') }}
			</Button>
		</div>
		<p class="sr-only" aria-live="polite">
			{{ loading ? $t('organisms.favorites.loading') : '' }}
		</p>
	</section>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { useId } from 'vue';
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';
const titleId = useId();
const sentinel = ref<HTMLElement | null>(null);
const rowHeightStyle = { '--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px` };
const { items, loading, hasLoaded, hasLoadError, isLastPage, load, loadMore } = useFavoritesList();
const canLoadMore = computed(
	() => hasLoaded.value && !loading.value && !isLastPage.value && items.value.length > 0
);
useIntersectionObserver(
	sentinel,
	([entry]) => {
		if (entry?.isIntersecting && canLoadMore.value) loadMore();
	},
	{ rootMargin: '240px' }
);
</script>
