<template>
	<NuxtLayout>
		<DrinksControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'listWithAuthorship', subject: 'Drink' }
});
</script>
