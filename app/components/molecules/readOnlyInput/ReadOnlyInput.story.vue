<template>
	<Story title="Molecules/ReadOnlyInput">
		<Variant title="text">
			<dl class="p-4 max-w-sm"><ReadOnlyInput label="name" value="Milliliter" /></dl>
		</Variant>
		<Variant title="empty">
			<dl class="p-4 max-w-sm"><ReadOnlyInput label="symbol" /></dl>
		</Variant>
		<Variant title="with help">
			<dl class="p-4 max-w-sm">
				<ReadOnlyInput
					label="gender"
					value="Masculine"
					help="Used to agree the words around the name." />
			</dl>
		</Variant>
	</Story>
</template>
