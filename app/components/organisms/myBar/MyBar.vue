<template>
	<div
		class="mx-auto flex w-full max-w-screen-desktop flex-col gap-6 px-4 pt-3 pb-6 tablet:px-6 tablet:pb-8">
		<!-- Same back link and spacing as the drink page: closer to the header than the sections below. -->
		<div class="flex flex-col gap-3">
			<Anchor
				:to="localePath('/')"
				class="self-start inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.myBar.backLink') }}
			</Anchor>
			<header class="flex flex-col gap-1">
				<h1 class="text-title-lg font-bold text-content tablet:text-headline-sm">
					{{ $t('organisms.myBar.title') }}
				</h1>
				<p class="max-w-2xl text-body text-content-secondary">
					{{ $t('organisms.myBar.description') }}
				</p>
			</header>
		</div>
		<!-- The bar lives in the browser storage, so it only exists on the client. -->
		<ClientOnly>
			<MyBarWorkspace />
			<template #fallback>
				<div
					class="grid items-start gap-6 tablet:grid-cols-[20rem_minmax(0,1fr)] desktop:grid-cols-[22rem_minmax(0,1fr)] desktop:gap-8"
					aria-hidden="true"
					data-testid="my-bar-fallback">
					<div
						class="h-96 rounded-card border border-stroke bg-surface shadow-card"></div>
					<ul class="grid list-none grid-cols-1 gap-4 desktop:grid-cols-2">
						<li
							v-for="index in 4"
							:key="index"
							class="flex h-(--drink-row-height) [&>*]:max-w-none"
							:style="rowHeightStyle">
							<DrinkCardSkeleton />
						</li>
					</ul>
				</div>
			</template>
		</ClientOnly>
	</div>
</template>
<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import { CARD_GRID_METRICS_PX } from '~/components/molecules/virtualInfiniteGrid/VirtualInfiniteGrid.contract';

const localePath = useLocalePath();
const rowHeightStyle = { '--drink-row-height': `${CARD_GRID_METRICS_PX.drinkRowHeight}px` };
</script>
