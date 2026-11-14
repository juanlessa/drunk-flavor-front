<template>
	<section
		class="flex flex-col items-center gap-3 rounded-card border border-stroke bg-surface px-6 py-10 text-center shadow-card"
		:aria-labelledby="titleId"
		data-testid="favorites-empty">
		<span
			class="grid size-16 place-items-center rounded-full bg-favorite-subtle text-favorite"
			aria-hidden="true">
			<HeartIcon filled class="size-8" />
		</span>
		<h2 :id="titleId" class="text-title-sm font-bold text-content">
			{{ $t('organisms.favorites.empty.title') }}
		</h2>
		<p class="max-w-sm text-body text-content-secondary">
			{{ $t('organisms.favorites.empty.description') }}
		</p>
		<!-- Shows the heart to look for; it is not a control, so it stays out of the tab order. -->
		<p
			class="inline-flex items-center gap-2 rounded-full bg-surface-sunken px-3 py-2 text-body-sm text-content-secondary">
			<span
				class="grid size-8 place-items-center rounded-full border border-stroke bg-surface text-content-secondary"
				aria-hidden="true">
				<HeartIcon class="size-4.5" />
			</span>
			{{ $t('organisms.favorites.empty.hint') }}
		</p>
		<div class="mt-2 flex w-full flex-col items-center">
			<Button variant="primary" @click="handleExplore">
				{{ $t('organisms.favorites.empty.action') }}
			</Button>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import HeartIcon from '~/components/icons/HeartIcon.vue';
const titleId = useId();
const localePath = useLocalePath();
const handleExplore = () => navigateTo(localePath('/').toString());
</script>
