<template>
	<Story title="Molecules/SearchSortToolbar">
		<template #controls="{ state }">
			<HstText v-model="(state as State).searchPlaceholder" title="search placeholder" />
			<HstText v-model="(state as State).sortLabel" title="sort label" />
		</template>
		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<SearchSortToolbar
					v-model:search-term="(state as State).searchTerm"
					v-model:sort="(state as State).sort"
					search-id="story-search"
					search-label="Search"
					sort-id="story-sort"
					:sort-label="(state as State).sortLabel"
					:search-placeholder="(state as State).searchPlaceholder"
					:sort-options="sortOptions" />
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	searchTerm: string;
	sort: string;
	searchPlaceholder: string;
	sortLabel: string;
};
const sortOptions = [
	{ label: 'Best rated', value: 'rating' },
	{ label: 'Name (A–Z)', value: 'name' },
	{ label: 'Newest', value: 'recent' }
];
function initState(): State {
	return {
		searchTerm: '',
		sort: 'rating',
		searchPlaceholder: 'Search drinks by name',
		sortLabel: 'Sort by'
	};
}
</script>
