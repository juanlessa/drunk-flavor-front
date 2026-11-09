<template>
	<div
		class="grid items-start gap-6 tablet:grid-cols-[20rem_minmax(0,1fr)] desktop:grid-cols-[22rem_minmax(0,1fr)] desktop:gap-8">
		<!--
			From tablet up the panel sits beside the drinks, and stays in view while they scroll when the window is
			tall enough to show all of it. It does not scroll on its own: the ingredient suggestions open inside it.
		-->
		<MyBarPanel
			ref="panel"
			class="tablet:top-4 tablet:[@media(min-height:52rem)]:sticky"
			:ingredients="ingredients"
			:max-missing="maxMissing"
			:is-full="isFull"
			@add="add"
			@remove="remove"
			@clear="clear"
			@update:max-missing="(value) => (maxMissing = value)" />
		<MyBarResults
			:matches="matches"
			:max-missing="maxMissing"
			:has-ingredients="ingredients.length > 0"
			:has-loaded="hasLoaded"
			:loading="loading"
			:is-last-page="isLastPage"
			@load-more="loadNextPage"
			@widen="(value) => (maxMissing = value)"
			@add-more="panel?.focusSearch()" />
	</div>
</template>
<script setup lang="ts">
import type MyBarPanel from './MyBarPanel.vue';

const panel = ref<InstanceType<typeof MyBarPanel> | null>(null);
const { ingredients, ingredientIds, maxMissing, isFull, add, remove, clear } = useMyBar();
const { matches, loading, hasLoaded, isLastPage, loadNextPage } = useDrinkMatch(
	ingredientIds,
	maxMissing
);
</script>
