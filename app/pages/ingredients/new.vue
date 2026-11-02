<template>
	<NuxtLayout>
		<CreateIngredient />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'create', subject: 'Ingredient' }
});
</script>
