<template>
	<NuxtLayout>
		<ViewIngredient :ingredient-id="ingredientId" />
	</NuxtLayout>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: 'auth',
	can: { action: 'getWithAuthorship', subject: 'Ingredient' }
});

const route = useRoute('ingredients-id');
const ingredientId = String(route.params.id);
</script>
