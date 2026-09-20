<template>
	<Box
		direction="row"
		class="w-screen min-h-screen items-center justify-center bg-surface tablet:bg-surface-sunken">
		<Box
			as="main"
			direction="col"
			class="flex-1 max-w-auth-panel p-4 rounded-auth-panel bg-surface tablet:shadow-card">
			<slot></slot>
		</Box>
	</Box>
</template>
<script setup lang="ts"></script>
