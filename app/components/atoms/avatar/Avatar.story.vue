<template>
	<Story title="Atoms/Avatar">
		<Variant title="Image">
			<div class="p-4">
				<Avatar src="https://i.pravatar.cc/160" alt="Profile avatar" size="lg" />
			</div>
		</Variant>
		<Variant title="Light and dark fallback">
			<div class="flex gap-4 p-4">
				<div class="bg-surface p-4">
					<Avatar alt="Profile placeholder" size="lg" :fallback-delay="0" />
				</div>
				<div class="dark bg-surface p-4">
					<Avatar alt="Profile placeholder" size="lg" :fallback-delay="0" />
				</div>
			</div>
		</Variant>
		<Variant title="Sizes">
			<div class="flex items-center gap-4 p-4">
				<Avatar alt="Small avatar" size="sm" :fallback-delay="0" />
				<Avatar alt="Medium avatar" size="md" :fallback-delay="0" />
				<Avatar alt="Large avatar" size="lg" :fallback-delay="0" />
			</div>
		</Variant>
	</Story>
</template>
