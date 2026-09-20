<template>
	<Story title="Atoms/AnimatedPlaceHolder">
		<Variant title="default">
			<div class="p-4">
				<AnimatedPlaceHolder />
			</div>
		</Variant>

		<Variant title="custom size via class">
			<div class="p-4">
				<AnimatedPlaceHolder class="w-40 h-5 rounded-xs" />
			</div>
		</Variant>

		<Variant title="fills container">
			<div class="p-4 h-24 w-64">
				<AnimatedPlaceHolder class="h-full w-full rounded-md" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup></script>
