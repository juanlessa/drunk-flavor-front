<template>
	<Box
		direction="row"
		class="w-screen min-h-screen items-center justify-center bg-white dark:bg-gray-900 tablet:bg-gray-100 tablet:dark:bg-gray-850">
		<Box
			as="main"
			direction="col"
			class="flex-1 max-w-[25rem] p-4 rounded-md bg-white dark:bg-gray-900 tablet:shadow-card">
			<slot></slot>
		</Box>
	</Box>
</template>
<script setup lang="ts"></script>
