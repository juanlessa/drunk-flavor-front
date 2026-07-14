<template>
	<NuxtLayout>
		<DrinksOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'guest'
});
</script>
