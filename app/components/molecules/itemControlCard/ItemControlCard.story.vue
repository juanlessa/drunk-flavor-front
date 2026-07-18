<template>
	<Story title="Molecules/ItemControlCard">
		<template #controls="{ state }">
			<HstText v-model="(state as State).content" title="content" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4 flex justify-center">
					<ItemControlCard :content="(state as State).content" />
				</div>
			</template>
		</Variant>

		<Variant title="multiple items" :init-state="initState">
			<template #default>
				<div class="p-4 flex flex-col gap-4 items-center">
					<ItemControlCard content="Rum" />
					<ItemControlCard content="Vodka" />
					<ItemControlCard content="Gin" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	content: string;
};

function initState(): State {
	return {
		content: 'Category name'
	};
}
</script>
