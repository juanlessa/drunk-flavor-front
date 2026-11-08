<template>
	<Box direction="col" class="w-screen min-h-dvh gap-2 bg-surface-sunken">
		<TopBar />

		<Box as="main" direction="col" class="flex-1 w-full">
			<slot></slot>
		</Box>
		<Footer />
	</Box>
</template>
<script setup lang="ts"></script>
