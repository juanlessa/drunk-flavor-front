<template>
	<NuxtLayout>
		<CategoriesControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'listWithAuthorship', subject: 'Category' }
});
</script>
