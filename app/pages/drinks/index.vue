<template>
	<NuxtLayout>
		<DrinksControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'Drink' }
});
</script>
