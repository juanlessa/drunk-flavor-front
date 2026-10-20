<template>
	<NuxtLayout name="primary">
		<CreateIngredient />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Ingredient' }
});
</script>
