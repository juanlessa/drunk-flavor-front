<template>
	<Story title="Atoms/Box">
		<Variant title="Row">
			<div class="p-4">
				<Box direction="row" class="gap-4">
					<div class="p-4 bg-surface-sunken rounded-md">Item 1</div>
					<div class="p-4 bg-surface-sunken rounded-md">Item 2</div>
					<div class="p-4 bg-surface-sunken rounded-md">Item 3</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Col">
			<div class="p-4">
				<Box direction="col" class="gap-4">
					<div class="p-4 bg-surface-sunken rounded-md">Item 1</div>
					<div class="p-4 bg-surface-sunken rounded-md">Item 2</div>
					<div class="p-4 bg-surface-sunken rounded-md">Item 3</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Responsive">
			<div class="p-4">
				<Box direction="responsive" class="gap-4">
					<div class="p-4 bg-surface-sunken rounded-md flex-1">Stacks on mobile</div>
					<div class="p-4 bg-surface-sunken rounded-md flex-1">Row on tablet+</div>
					<div class="p-4 bg-surface-sunken rounded-md flex-1">Resize to see</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Wrap">
			<div class="p-4 max-w-xs">
				<Box direction="wrap" class="gap-4">
					<div class="p-4 bg-surface-sunken rounded-md w-24">A</div>
					<div class="p-4 bg-surface-sunken rounded-md w-24">B</div>
					<div class="p-4 bg-surface-sunken rounded-md w-24">C</div>
					<div class="p-4 bg-surface-sunken rounded-md w-24">D</div>
					<div class="p-4 bg-surface-sunken rounded-md w-24">E</div>
				</Box>
			</div>
		</Variant>
	</Story>
</template>
