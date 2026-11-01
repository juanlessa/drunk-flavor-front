<template>
	<Story title="Molecules/ManagementToolbar">
		<template #controls="{ state }">
			<HstText v-model="(state as State).searchPlaceholder" title="search placeholder" />
			<HstText v-model="(state as State).createLabel" title="create label" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<ManagementToolbar
					v-model:search-term="(state as State).searchTerm"
					search-id="story-search"
					search-label="Search"
					:search-placeholder="(state as State).searchPlaceholder"
					:create-label="(state as State).createLabel" />
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	searchTerm: string;
	searchPlaceholder: string;
	createLabel: string;
};

function initState(): State {
	return {
		searchTerm: '',
		searchPlaceholder: 'Search ingredients by name',
		createLabel: 'New ingredient'
	};
}
</script>
