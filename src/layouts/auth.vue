<template>
	<div
		class="w-screen min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 tablet:bg-gray-100 tablet:dark:bg-gray-850">
		<main
			class="flex-1 max-w-[25rem] p-4 rounded-md bg-white dark:bg-gray-900 tablet:shadow-light-card dark:tablet:shadow-dark-card">
			<slot></slot>
		</main>
	</div>
</template>
<script setup lang="ts"></script>
