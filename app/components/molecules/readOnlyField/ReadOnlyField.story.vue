<template>
	<Story title="Molecules/ReadOnlyField">
		<Variant title="text">
			<dl class="p-4 max-w-sm"><ReadOnlyField label="name" value="Coffee liqueur" /></dl>
		</Variant>
		<Variant title="empty">
			<dl class="p-4 max-w-sm"><ReadOnlyField label="description" /></dl>
		</Variant>
		<Variant title="flags">
			<dl class="p-4 max-w-sm flex flex-col gap-4">
				<ReadOnlyField label="alcoholic" :flag="true" />
				<ReadOnlyField label="allow decimals" :flag="false" />
			</dl>
		</Variant>
	</Story>
</template>
