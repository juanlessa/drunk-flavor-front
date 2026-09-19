<template>
	<div class="w-screen min-h-screen flex flex-col gap-2 bg-gray-100 dark:bg-gray-800">
		<TopBar />
		<Box
			as="main"
			direction="col"
			class="flex-1 w-full max-w-screen-desktop mx-auto bg-white dark:bg-gray-900">
			<slot></slot>
		</Box>
		<Footer />
	</div>
</template>
<script setup lang="ts"></script>
