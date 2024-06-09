<template>
	<div class="w-screen min-h-screen flex flex-col gap-2 bg-gray-100 dark:bg-gray-800">
		<TopBar />
		<div
			:class="[
				'flex flex-col flex-1 w-full max-w-screen-desktop mx-auto',
				{ 'bg-white dark:bg-gray-900': props.bgPrimary }
			]">
			<main class="flex-1">
				<slot></slot>
			</main>
		</div>
	</div>
</template>
<script setup lang="ts">
const props = defineProps({
	bgPrimary: {
		type: Boolean,
		default: false
	}
});
</script>
