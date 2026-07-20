<template>
	<Story title="Atoms/Box">
		<Variant title="Row">
			<div class="p-4">
				<Box direction="row" class="gap-4">
					<div class="p-4 bg-blue-200 rounded-md">Item 1</div>
					<div class="p-4 bg-blue-300 rounded-md">Item 2</div>
					<div class="p-4 bg-blue-400 rounded-md">Item 3</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Col">
			<div class="p-4">
				<Box direction="col" class="gap-4">
					<div class="p-4 bg-green-200 rounded-md">Item 1</div>
					<div class="p-4 bg-green-300 rounded-md">Item 2</div>
					<div class="p-4 bg-green-400 rounded-md">Item 3</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Responsive">
			<div class="p-4">
				<Box direction="responsive" class="gap-4">
					<div class="p-4 bg-purple-200 rounded-md flex-1">Stacks on mobile</div>
					<div class="p-4 bg-purple-300 rounded-md flex-1">Row on tablet+</div>
					<div class="p-4 bg-purple-400 rounded-md flex-1">Resize to see</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Wrap">
			<div class="p-4 max-w-xs">
				<Box direction="wrap" class="gap-4">
					<div class="p-4 bg-amber-200 rounded-md w-24">A</div>
					<div class="p-4 bg-amber-300 rounded-md w-24">B</div>
					<div class="p-4 bg-amber-400 rounded-md w-24">C</div>
					<div class="p-4 bg-amber-200 rounded-md w-24">D</div>
					<div class="p-4 bg-amber-300 rounded-md w-24">E</div>
				</Box>
			</div>
		</Variant>

		<Variant title="Container Responsive">
			<template #controls>
				<HstSelect
					v-model="state.containerBreakpoint"
					title="containerBreakpoint"
					:options="boxContainerBreakpointOptions" />
			</template>
			<div class="p-4 flex flex-col gap-4">
				<Box direction="col" container class="gap-4 p-4 w-40 border">
					<Text>@container box fixed width:10rem</Text>
					<Box
						direction="container-responsive"
						:container-breakpoint="state.containerBreakpoint"
						class="gap-4">
						<div class="p-4 bg-rose-200 rounded-md flex-1">Col by default</div>
						<div class="p-4 bg-rose-300 rounded-md flex-1">Row at breakpoint</div>
					</Box>
				</Box>
				<Box direction="col" container class="gap-4 p-4 border">
					<Text>@container box non fixed width</Text>
					<Box
						direction="container-responsive"
						:container-breakpoint="state.containerBreakpoint"
						class="gap-4">
						<div class="p-4 bg-rose-200 rounded-md flex-1">Col by default</div>
						<div class="p-4 bg-rose-300 rounded-md flex-1">Row at breakpoint</div>
					</Box>
				</Box>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { BoxContainerBreakpoint } from './Box.types';
import { boxContainerBreakpointOptions } from './Box.constants';

const state = reactive({
	containerBreakpoint: 'md' as BoxContainerBreakpoint
});
</script>
