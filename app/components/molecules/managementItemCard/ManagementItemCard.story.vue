<template>
	<Story title="Molecules/ManagementItemCard">
		<template #controls="{ state }">
			<HstText v-model="(state as State).title" title="title" />
			<HstText v-model="(state as State).description" title="description" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4 max-w-sm">
					<ManagementItemCard
						:title="(state as State).title"
						:description="(state as State).description" />
				</div>
			</template>
		</Variant>

		<Variant title="grid" :init-state="initState">
			<template #default>
				<div class="p-4 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
					<ManagementItemCard title="Angostura bitters" description="Bitters · dash" />
					<ManagementItemCard title="Cachaça" description="Spirit · ml" />
					<ManagementItemCard title="Cointreau" description="Liqueur · ml" />
					<ManagementItemCard title="Mint leaves" description="Garnish · leaf" />
				</div>
			</template>
		</Variant>

		<Variant title="with media">
			<div class="p-4 max-w-sm flex flex-col gap-4">
				<ManagementItemCard title="Mojito" description="5 ingredients">
					<template #media>
						<img
							src="/images/logo-mark.svg"
							alt=""
							class="size-11 shrink-0 rounded-control object-cover" />
					</template>
				</ManagementItemCard>
				<ManagementItemCardSkeleton media />
			</div>
		</Variant>

		<Variant title="read-only">
			<div class="p-4 max-w-sm flex flex-col gap-4">
				<ManagementItemCard title="Gin" description="Spirit · ml" readonly />
				<ManagementItemCard
					title="Gin"
					description="Not selectable"
					readonly
					:selectable="false" />
			</div>
		</Variant>
		<Variant title="with skeleton">
			<div class="p-4 max-w-sm flex flex-col gap-4">
				<ManagementItemCard title="Angostura bitters" description="Bitters · dash" />
				<ManagementItemCardSkeleton />
			</div>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	title: string;
	description: string;
};

function initState(): State {
	return {
		title: 'Angostura bitters',
		description: 'Bitters · dash'
	};
}
</script>
