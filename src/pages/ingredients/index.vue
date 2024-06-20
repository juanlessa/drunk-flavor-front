<template>
	<NuxtLayout>
		<IngredientsControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth'
});
</script>
