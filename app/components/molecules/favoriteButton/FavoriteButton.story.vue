<template>
	<Story title="Molecules/FavoriteButton">
		<Variant title="chip over a thumbnail">
			<div class="relative size-36 rounded-card bg-surface-sunken">
				<FavoriteButton
					drink-id="drink-1"
					drink-name="Mojito"
					variant="chip"
					class="top-1 right-1" />
			</div>
		</Variant>
		<Variant title="media over a cover">
			<div class="relative h-40 w-72 rounded-media bg-neutral-700">
				<FavoriteButton
					drink-id="drink-1"
					drink-name="Mojito"
					variant="media"
					class="top-3 right-3" />
			</div>
		</Variant>
		<Variant title="pill">
			<div class="p-4">
				<FavoriteButton drink-id="drink-1" drink-name="Mojito" variant="pill" />
			</div>
		</Variant>
	</Story>
</template>
<script lang="ts" setup></script>
