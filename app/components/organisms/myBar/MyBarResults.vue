<template>
	<section :aria-labelledby="titleId" class="flex min-w-0 flex-col gap-4">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<h2 :id="titleId" class="text-title-sm font-bold text-content">
				{{ $t('organisms.myBar.results.title') }}
			</h2>
			<span v-if="props.matches.length" class="text-body-sm text-content-muted">
				{{ $t('organisms.myBar.results.hint') }}
			</span>
		</div>

		<div
			v-if="!props.hasIngredients"
			class="flex flex-col items-center gap-3 rounded-card border border-stroke bg-surface px-6 py-10 text-center shadow-card"
			data-testid="my-bar-start">
			<span
				class="grid size-16 place-items-center rounded-full bg-accent-subtle text-headline-sm"
				aria-hidden="true">
				🍸
			</span>
			<h3 class="text-title-sm font-bold text-content">
				{{ $t('organisms.myBar.start.title') }}
			</h3>
			<p class="max-w-sm text-body text-content-secondary">
				{{ $t('organisms.myBar.start.description') }}
			</p>
			<Button variant="primary" class="mt-2" @click="emit('addMore')">
				{{ $t('organisms.myBar.empty.addMore') }}
			</Button>
		</div>

		<div
			v-else-if="props.hasLoaded && props.matches.length === 0"
			class="flex flex-col items-center gap-3 rounded-card border border-stroke bg-surface px-6 py-10 text-center shadow-card"
			data-testid="my-bar-empty">
			<span
				class="grid size-16 place-items-center rounded-full bg-accent-subtle text-headline-sm"
				aria-hidden="true">
				🍸
			</span>
			<h3 class="text-title-sm font-bold text-content">
				{{ $t(`organisms.myBar.empty.title.${props.maxMissing}`) }}
			</h3>
			<p class="max-w-sm text-body text-content-secondary">
				{{ $t(`organisms.myBar.empty.description.${widerMaxMissing ?? 'none'}`) }}
			</p>
			<div class="mt-2 flex w-full flex-col items-center gap-2">
				<Button
					v-if="widerMaxMissing !== undefined"
					variant="primary"
					@click="emit('widen', widerMaxMissing)">
					{{ $t(`organisms.myBar.empty.widen.${widerMaxMissing}`) }}
				</Button>
				<Button
					:variant="widerMaxMissing === undefined ? 'primary' : 'secondary'"
					@click="emit('addMore')">
					{{ $t('organisms.myBar.empty.addMore') }}
				</Button>
			</div>
		</div>

		<div v-else class="flex flex-col gap-5" :aria-busy="props.loading">
			<section
				v-for="group in groups"
				:key="group.missingCount"
				:aria-labelledby="`${titleId}-group-${group.missingCount}`"
				class="flex flex-col gap-3">
				<h3
					:id="`${titleId}-group-${group.missingCount}`"
					class="flex items-center gap-3 text-caption font-bold uppercase tracking-wide text-content-muted after:h-px after:flex-1 after:bg-stroke">
					{{ groupLabel(group.missingCount) }}
				</h3>
				<ul class="grid list-none grid-cols-1 gap-4 desktop:grid-cols-2">
					<li
						v-for="match in group.matches"
						:key="match.drink.id"
						class="flex h-(--drink-row-height) [&>*]:max-w-none"
						:style="rowHeightStyle">
						<DrinkCard
							:drink="match.drink"
							:missing-ingredient-ids="match.missingIngredientIds" />
					</li>
				</ul>
			</section>
			<ul
				v-if="props.loading"
				class="grid list-none grid-cols-1 gap-4 desktop:grid-cols-2"
				aria-hidden="true"
				data-testid="my-bar-loading">
				<li
					v-for="index in props.matches.length ? 2 : 4"
					:key="index"
					class="flex h-(--drink-row-height) [&>*]:max-w-none"
					:style="rowHeightStyle">
					<DrinkCardSkeleton />
				</li>
			</ul>
			<!-- Loads the next page as it scrolls into view; the button also works with a keyboard or a click. -->
			<div v-if="canLoadMore" ref="sentinel" class="flex justify-center">
				<Button variant="secondary" size="sm" @click="emit('loadMore')">
					{{ $t('organisms.myBar.results.loadMore') }}
				</Button>
			</div>
			<p class="sr-only" aria-live="polite">
				{{ props.loading ? $t('organisms.myBar.results.loading') : '' }}
			</p>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { useId } from 'vue';
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';
import type { DrinkMatch, DrinkMatchMaxMissing } from '~/domain/drink/drink.entity';
import { getWiderMaxMissing, groupMatchesByMissingCount } from '~/helpers/drinkMatch.helpers';

const props = defineProps({
	matches: { type: Array as PropType<readonly DrinkMatch[]>, default: () => [] },
	maxMissing: { type: [Number, String] as PropType<DrinkMatchMaxMissing>, default: 0 },
	/** Whether the bar has ingredients; without them there is nothing to match yet. */
	hasIngredients: { type: Boolean, default: false },
	/** Whether the first page of the current search arrived, so no match means nothing was found. */
	hasLoaded: { type: Boolean, default: false },
	loading: { type: Boolean, default: false },
	isLastPage: { type: Boolean, default: false }
});
const emit = defineEmits<{
	(e: 'loadMore' | 'addMore'): void;
	(e: 'widen', value: DrinkMatchMaxMissing): void;
}>();

const { t } = useI18n();
const titleId = useId();
const sentinel = ref<HTMLElement | null>(null);
const rowHeightStyle = { '--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px` };

const groups = computed(() => groupMatchesByMissingCount(props.matches));
const widerMaxMissing = computed(() => getWiderMaxMissing(props.maxMissing));
const canLoadMore = computed(
	() => props.hasLoaded && !props.loading && !props.isLastPage && props.matches.length > 0
);

const groupLabel = (missingCount: number) =>
	missingCount === 0
		? t('organisms.myBar.results.groups.ready')
		: t('organisms.myBar.results.groups.missing', { count: missingCount }, missingCount);

useIntersectionObserver(
	sentinel,
	([entry]) => {
		if (entry?.isIntersecting && canLoadMore.value) emit('loadMore');
	},
	{ rootMargin: '240px' }
);
</script>
