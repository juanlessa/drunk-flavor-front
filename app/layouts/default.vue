<template>
	<Box direction="col" class="w-screen h-dvh overflow-hidden gap-2 bg-surface-sunken">
		<!-- The top bar and the footer stay in place; only the content between them scrolls. -->
		<div class="shrink-0">
			<TopBar />
		</div>
		<div ref="scroller" class="flex min-h-0 flex-1 flex-col overflow-y-auto">
			<Box as="main" direction="col" class="flex-1 w-full">
				<slot></slot>
			</Box>
		</div>
		<div class="shrink-0">
			<Footer />
		</div>
	</Box>
</template>
<script setup lang="ts">
const scroller = ref<HTMLElement | null>(null);
useScrollResetOnNavigation(scroller);
</script>
