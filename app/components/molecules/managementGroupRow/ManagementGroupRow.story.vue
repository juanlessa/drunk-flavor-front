<template>
	<Story title="Molecules/ManagementGroupRow">
		<Variant title="own header">
			<div class="p-4 max-w-sm h-[68px]">
				<ManagementGroupRow variant="header" group="own" />
			</div>
		</Variant>
		<Variant title="others header">
			<div class="p-4 max-w-sm h-[68px]">
				<ManagementGroupRow variant="header" group="others" />
			</div>
		</Variant>
		<Variant title="empty own">
			<div class="p-4 max-w-md h-[68px]">
				<ManagementGroupRow variant="empty-own" create-label="New category" />
			</div>
		</Variant>
	</Story>
</template>
