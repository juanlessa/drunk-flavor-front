<template>
	<NuxtLayout>
		<IngredientsControlOverview />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'manage', subject: 'Ingredient' }
});
</script>
