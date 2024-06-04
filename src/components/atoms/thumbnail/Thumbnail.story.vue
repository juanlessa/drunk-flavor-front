<template>
	<Story title="Atoms/Thumbnail">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.src" title="src" />
			<HstText v-model="state.alt" title="alt" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<div class="m-3">
					<Thumbnail :src="state.src" :alt="state.alt" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	src: string;
	alt: string;
};
function initState(): State {
	return {
		src: '',
		alt: ''
	};
}
</script>
